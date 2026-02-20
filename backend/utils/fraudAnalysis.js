const WEIGHTS = {
  distanceScore: 10,
  travelSpeedScore: 15,
  amountSpikeScore: 12,
  aboveAverageScore: 8,
  highAbsoluteAmountScore: 8,
  newDeviceScore: 10,
  vpnScore: 10,
  velocityScore: 10,
  failedLoginScore: 7,
  unusualTimeScore: 5,
  internationalScore: 5,
  newAccountScore: 8,
  merchantRiskScore: 8,
  sharedDeviceScore: 10,
  countryChangeScore: 8,
};

const TOTAL_WEIGHT = Object.values(WEIGHTS).reduce((a, b) => a + b, 0);
const HIGH_AMOUNT_THRESHOLD = 100000;
const IMPOSSIBLE_SPEED_KMH = 900;
const VELOCITY_WINDOW_MIN = 5;
const VELOCITY_THRESHOLD = 3;
const UNUSUAL_HOUR_DELTA = 4;

const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const clamp = (val) => Math.min(1, Math.max(0, val));

const analyzeFraud = ({ txnData, user, device, merchant, recentTxnCount, lastTxn }) => {
  const signals = {};
  const riskReasons = [];
  const triggeredCombinations = [];
  const txnHour = new Date().getHours();

  // 1. Distance & Travel Speed
  let distanceKm = 0;
  let travelSpeed = 0;

  if (lastTxn && user.lastLocation?.latitude && txnData.location?.latitude) {
    distanceKm = haversineDistance(
      user.lastLocation.latitude,
      user.lastLocation.longitude,
      txnData.location.latitude,
      txnData.location.longitude
    );
    const timeDiffHrs = (Date.now() - new Date(lastTxn.createdAt).getTime()) / (1000 * 60 * 60);
    travelSpeed = timeDiffHrs > 0 ? distanceKm / timeDiffHrs : 0;
  }

  signals.distanceScore = clamp(distanceKm / 2000);
  if (distanceKm > 500) riskReasons.push(`High distance jump: ${Math.round(distanceKm)} km`);

  signals.travelSpeedScore = travelSpeed > IMPOSSIBLE_SPEED_KMH ? 1 : clamp(travelSpeed / IMPOSSIBLE_SPEED_KMH);
  if (travelSpeed > IMPOSSIBLE_SPEED_KMH) riskReasons.push(`Impossible travel speed: ${Math.round(travelSpeed)} km/hr`);

  // 2. Country Change
  const prevCountry = user.lastLocation?.country || "India";
  const currCountry = txnData.location?.country || "India";
  signals.countryChangeScore = prevCountry !== currCountry ? 1 : 0;
  if (prevCountry !== currCountry) riskReasons.push(`Country change: ${prevCountry} → ${currCountry}`);

  // 3. Monetary Signals
  const avgAmt = user.averageTransactionAmount || 1;
  const amtRatio = txnData.amount / avgAmt;

  signals.amountSpikeScore = amtRatio > 3 ? clamp((amtRatio - 3) / 7 + 0.6) : clamp(amtRatio / 10);
  if (amtRatio > 3) riskReasons.push(`Amount spike: ${amtRatio.toFixed(1)}× user average`);

  signals.aboveAverageScore = clamp((txnData.amount - avgAmt) / (avgAmt * 5));
  if (txnData.amount > avgAmt * 1.5) riskReasons.push(`Above average amount (avg: ₹${Math.round(avgAmt)})`);

  signals.highAbsoluteAmountScore = txnData.amount >= HIGH_AMOUNT_THRESHOLD ? 1 : clamp(txnData.amount / HIGH_AMOUNT_THRESHOLD);
  if (txnData.amount >= HIGH_AMOUNT_THRESHOLD) riskReasons.push(`Very high amount: ₹${txnData.amount}`);

  // 4. Device Signals
  const isNewDevice = !user.knownDevices.includes(txnData.deviceId);
  signals.newDeviceScore = isNewDevice ? 1 : 0;
  if (isNewDevice) riskReasons.push("New/unrecognized device");

  signals.vpnScore = device?.isVPN || device?.isProxy || device?.isTor ? 1 : 0;
  if (signals.vpnScore) riskReasons.push("VPN / Proxy / Tor detected");

  signals.sharedDeviceScore = device?.isSharedDevice ? 1 : 0;
  if (device?.isSharedDevice) riskReasons.push("Device used by multiple accounts");

  // 5. Velocity
  signals.velocityScore = recentTxnCount >= VELOCITY_THRESHOLD ? clamp(recentTxnCount / 10) : 0;
  if (recentTxnCount >= VELOCITY_THRESHOLD)
    riskReasons.push(`High velocity: ${recentTxnCount} transactions in last ${VELOCITY_WINDOW_MIN} min`);

  // 6. Failed Logins
  signals.failedLoginScore = clamp(user.failedLoginAttempts / 5);
  if (user.failedLoginAttempts >= 3) riskReasons.push(`${user.failedLoginAttempts} failed login attempts`);

  // 7. Unusual Time
  const hourDelta = user.usualTransactionHour !== null
    ? Math.abs(txnHour - user.usualTransactionHour)
    : 0;
  const normalizedHourDelta = Math.min(hourDelta, 24 - hourDelta);
  signals.unusualTimeScore = clamp(normalizedHourDelta / 12);
  if (normalizedHourDelta >= UNUSUAL_HOUR_DELTA)
    riskReasons.push(`Unusual transaction time: ${txnHour}:00 (usual: ${user.usualTransactionHour}:00)`);

  // 8. International
  signals.internationalScore = txnData.isInternational ? 1 : 0;
  if (txnData.isInternational) riskReasons.push("International transaction");

  // 9. Account Age
  const ageDays = user.accountAgeDays || 0;
  signals.newAccountScore = ageDays < 30 ? clamp(1 - ageDays / 30) : 0;
  if (ageDays < 30) riskReasons.push(`New account: ${ageDays} days old`);

  // 10. Merchant Risk
  signals.merchantRiskScore = merchant ? clamp(merchant.riskScore) : 0.5;
  if (merchant?.isHighRiskCategory) riskReasons.push(`High-risk merchant category: ${merchant.category}`);
  if (merchant?.totalFraudReports > 5) riskReasons.push(`Merchant has ${merchant.totalFraudReports} fraud reports`);

  // Weighted Score
  let weightedSum = 0;
  for (const [key, weight] of Object.entries(WEIGHTS)) {
    weightedSum += (signals[key] || 0) * weight;
  }
  const riskScore = Math.round((weightedSum / TOTAL_WEIGHT) * 100);
  const fraudProbability = parseFloat((riskScore / 100).toFixed(2));

  let riskLevel = "low";
  if (riskScore >= 75) riskLevel = "critical";
  else if (riskScore >= 50) riskLevel = "high";
  else if (riskScore >= 25) riskLevel = "medium";

  // Combination Logic
  if (isNewDevice && txnData.amount >= HIGH_AMOUNT_THRESHOLD)
    triggeredCombinations.push("New device + High amount");
  if (signals.vpnScore && txnData.isInternational && txnData.amount >= HIGH_AMOUNT_THRESHOLD)
    triggeredCombinations.push("VPN + International + Large amount");
  if (signals.unusualTimeScore >= 0.5 && isNewDevice)
    triggeredCombinations.push("Night-time + New device");
  if (recentTxnCount >= VELOCITY_THRESHOLD && signals.vpnScore)
    triggeredCombinations.push("Rapid velocity + VPN");
  if (signals.travelSpeedScore === 1 && isNewDevice)
    triggeredCombinations.push("Impossible speed + New device");

  return { riskScore, riskLevel, fraudProbability, signals, riskReasons, triggeredCombinations };
};

const computeTransactionFlags = ({ txnData, user, device, recentTxnCount, lastTxn }) => {
  const txnHour = new Date().getHours();
  const avgAmt = user.averageTransactionAmount || 1;

  let distanceFromLastTxn = 0;
  let travelSpeed = 0;

  if (lastTxn && user.lastLocation?.latitude && txnData.location?.latitude) {
    distanceFromLastTxn = haversineDistance(
      user.lastLocation.latitude,
      user.lastLocation.longitude,
      txnData.location.latitude,
      txnData.location.longitude
    );
    const timeDiffHrs = (Date.now() - new Date(lastTxn.createdAt).getTime()) / (1000 * 60 * 60);
    travelSpeed = timeDiffHrs > 0 ? distanceFromLastTxn / timeDiffHrs : 0;
  }

  const hourDelta = user.usualTransactionHour !== null
    ? Math.abs(txnHour - user.usualTransactionHour)
    : 0;

  return {
    distanceFromLastTxn: Math.round(distanceFromLastTxn),
    travelSpeed: Math.round(travelSpeed),
    amountDeviation: txnData.amount - avgAmt,
    isAmountSpike: txnData.amount > avgAmt * 3,
    isHighAbsoluteAmount: txnData.amount >= HIGH_AMOUNT_THRESHOLD,
    isNewDevice: !user.knownDevices.includes(txnData.deviceId),
    isVPN: !!(device?.isVPN || device?.isProxy || device?.isTor),
    isSharedDevice: !!(device?.isSharedDevice),
    transactionHour: txnHour,
    isUnusualTime: Math.min(hourDelta, 24 - hourDelta) >= UNUSUAL_HOUR_DELTA,
    transactionsLast5Min: recentTxnCount,
    failedLoginsBefore: user.failedLoginAttempts,
    notificationsDisabled: !user.notificationsEnabled,
    recentPasswordChange: user.passwordChangedAt
      ? Date.now() - new Date(user.passwordChangedAt).getTime() < 24 * 60 * 60 * 1000
      : false,
  };
};

export { analyzeFraud, computeTransactionFlags, haversineDistance };
