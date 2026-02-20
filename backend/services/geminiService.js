import { GoogleGenerativeAI } from "@google/generative-ai";
import { getRedisClient, KEYS } from "../config/redis.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ─── System Instruction (no embedded JSON — prevents regex collision) ─────────
const SYSTEM_INSTRUCTION = `You are FraudShield AI, an expert-level financial fraud detection engine deployed at a leading Indian bank. You analyze real-time payment transactions and return structured risk assessments.

ROLE: You are the final AI decision layer in a multi-stage fraud pipeline. You receive pre-computed signals from a rule engine alongside raw transaction context and synthesize them into a holistic fraud verdict. Your analysis must reflect Indian banking patterns: UPI collect scams, OTP phishing, card-not-present fraud, mule accounts, and IMPS/RTGS abuse.

ANALYSIS DIMENSIONS (evaluate in order):
1. GEOSPATIAL: Is distance between last known location and current location physically plausible given elapsed time? Speed > 900 km/h is impossible without flight.
2. AMOUNT ANOMALY: Is this amount > 2x the user's average? > 5x is critical. First large transaction from a new account is high risk.
3. DEVICE INTELLIGENCE: New device + high-value transaction = elevated risk. VPN/proxy/Tor usage is suspicious. Shared device (linked to multiple accounts) suggests fraud ring.
4. VELOCITY: > 3 transactions in 5 minutes is suspicious. > 5 in 5 minutes is critical.
5. TEMPORAL: Transactions between 1–4 AM local time with no prior history of night transactions are suspicious.
6. ACCOUNT BEHAVIOR: Account age < 7 days = high risk. Failed login attempts before transaction = account takeover risk.
7. MERCHANT: High-risk merchant category + cross-border + no prior relationship = elevated risk.

COMBINATION PATTERNS (escalate risk):
- New device + VPN + high amount = account takeover attempt
- High velocity + new account + large amount = mule account pattern
- Failed logins + new device + international = account compromise
- Rapid cross-border transactions = card cloning / testing
- UPI collect request from unknown merchant = social engineering

PAYMENT-METHOD SPECIFICS:
- UPI: Collect requests are riskier than push. Unusual beneficiary VPA patterns are suspicious.
- Card: International card-not-present transactions without prior travel history are suspicious.
- Bank Transfer: IMPS > ₹5L at odd hours is suspicious. RTGS minimum ₹2L is inherently high-value.

SCORING RULES:
- riskScore 0–24: LOW, verdict approve
- riskScore 25–49: MEDIUM, verdict approve
- riskScore 50–74: HIGH, verdict flag
- riskScore 75–100: CRITICAL, verdict block
- Minimum baseline score is 2, never return 0.
- Multiple combination patterns: escalate by at least 15 points.
- Account age < 7 days + any monetary flag: minimum score 60.

OUTPUT CONTRACT:
Respond with ONLY a valid JSON object. No markdown. No code fences. No explanation outside JSON.
Required fields (keep output compact):
- riskScore: integer 0-100
- riskLevel: string (low|medium|high|critical)
- fraudProbability: float 0.0-1.0
- verdict: string (approve|flag|block)
- topSignals: object with up to 5 key-value pairs (signal_name:float), only highest scoring signals
- riskReasons: array of up to 4 short strings
- triggeredCombinations: array of up to 3 strings (empty if none)
- recommendedAction: one of (approve_transaction|hold_for_review|block_and_alert|block_and_lock_account)
- confidence: float 0.0-1.0
- explanation: 1-2 sentence string`;

// ─── Build context for Gemini ─────────────────────────────────────────────────
const buildTransactionContext = ({ txnData, user, device, merchant, recentTxnCount, lastTxn, flags }) => {
  const ctx = {
    transaction: {
      amount: txnData.amount,
      currency: txnData.currency || "INR",
      paymentMethod: txnData.paymentMethod,
      paymentChannel: txnData.paymentChannel || "mobile_app",
      location: txnData.location,
      isInternational: txnData.isInternational || false,
      timestamp: new Date().toISOString(),
      transactionHour: new Date().getHours(),
    },
    userProfile: {
      accountAgeDays: user.accountAgeDays || 0,
      averageTransactionAmount: user.averageTransactionAmount || 0,
      totalTransactions: user.totalTransactions || 0,
      usualTransactionHour: user.usualTransactionHour,
      balance: user.balance || 0,
      lastLocation: user.lastLocation,
      knownCountries: user.knownCountries || [],
      failedLoginAttempts: user.failedLoginAttempts || 0,
      isLocked: user.isLocked || false,
      knownDeviceCount: user.knownDevices?.length || 0,
      passwordChangedRecently: user.passwordChangedAt
        ? Date.now() - new Date(user.passwordChangedAt).getTime() < 86_400_000
        : false,
    },
    deviceIntelligence: {
      isNewDevice: !user.knownDevices?.includes(txnData.deviceId),
      isVPN: device?.isVPN || false,
      isProxy: device?.isProxy || false,
      isTor: device?.isTor || false,
      isSharedDevice: device?.isSharedDevice || false,
      linkedAccountCount: device?.linkedUserIds?.length || 0,
      isTrusted: device?.isTrusted || false,
    },
    merchantProfile: {
      name: merchant?.name,
      category: merchant?.category,
      country: merchant?.country,
      riskScore: merchant?.riskScore || 0,
      totalFraudReports: merchant?.totalFraudReports || 0,
      isHighRiskCategory: merchant?.isHighRiskCategory || false,
      isCrossBorder: merchant?.isCrossBorder || false,
    },
    velocityData: {
      transactionsInLast5Minutes: recentTxnCount || 0,
    },
    preComputedFlags: flags,
    previousTransaction: lastTxn
      ? {
          amount: lastTxn.amount,
          location: lastTxn.location,
          createdAt: lastTxn.createdAt,
          paymentMethodType: lastTxn.paymentMethod?.type,
          distanceFromCurrent: flags?.distanceFromLastTxn || 0,
          travelSpeedKmHr: flags?.travelSpeed || 0,
        }
      : null,
  };
  return JSON.stringify(ctx, null, 2);
};

// ─── Core analysis function ───────────────────────────────────────────────────
const analyzeWithGemini = async ({ txnData, user, device, merchant, recentTxnCount, lastTxn, flags }) => {
  const redis = getRedisClient();

  const cacheKey = KEYS.cache(
    `gemini:${user._id}:${txnData.amount}:${Math.floor(Date.now() / 10_000)}`
  );
  const cached = await redis.get(cacheKey).catch(() => null);
  if (cached) return { ...JSON.parse(cached), source: "gemini_cached" };

  const context = buildTransactionContext({ txnData, user, device, merchant, recentTxnCount, lastTxn, flags });
  const userPrompt = `Analyze this financial transaction for fraud risk. Return ONLY the JSON object.\n\nTRANSACTION CONTEXT:\n${context}`;

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 0.1,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 8192,
        responseMimeType: "application/json",
      },
    });

    // Inline system instruction into user message — more reliable with JSON mode
    const fullPrompt = `${SYSTEM_INSTRUCTION}\n\n${userPrompt}`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
    });

    let text = result.response.text().trim();

    // Strip any accidental markdown fences
    if (text.startsWith("```")) {
      text = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
    }

    // Isolate the first top-level JSON object
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("No JSON object in Gemini response");
    const parsed = JSON.parse(match[0]);

    if (typeof parsed.riskScore !== "number" || !parsed.riskLevel) {
      throw new Error("Gemini returned invalid schema");
    }

    parsed.riskScore = Math.max(2, Math.min(100, parsed.riskScore));
    parsed.source = "gemini";

    await redis.setex(cacheKey, 30, JSON.stringify(parsed)).catch(() => {});
    return parsed;
  } catch (err) {
    console.error("Gemini analysis failed, falling back to local:", err.message);
    return null;
  }
};

export { analyzeWithGemini, SYSTEM_INSTRUCTION };
