export const currentUser = {
  id: 'user_001',
  name: 'Digamber Singh',
  email: 'digamber.singh@email.com',
  phone: '+91 98765 43210',
  balance: 84500,
  currency: 'INR',
  totalTransactions: 47,
  averageTransactionAmount: 4200,
  accountAgeDays: 240,
  isLocked: false,
  avatar: 'DS'
};

export const mockTransactions = [
  {
    id: 'txn_001',
    userId: 'user_001',
    merchant: 'Amazon India',
    merchantCategory: 'Shopping',
    amount: 12500,
    type: 'debit',
    status: 'completed',
    paymentMethod: 'card',
    cardDetails: {
      last4: '4242',
      cardBrand: 'Visa',
      cardType: 'credit',
      bankName: 'HDFC Bank'
    },
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    location: 'Mumbai, MH',
    referenceId: 'REF001234567',
    riskScore: 15,
    riskLevel: 'low',
    isFlagged: false
  },
  {
    id: 'txn_002',
    userId: 'user_001',
    merchant: 'Swiggy',
    merchantCategory: 'Food & Dining',
    amount: 850,
    type: 'debit',
    status: 'completed',
    paymentMethod: 'upi',
    upiDetails: {
      upiId: 'digamber@paytm',
      upiApp: 'Paytm'
    },
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    location: 'Mumbai, MH',
    referenceId: 'REF001234568',
    riskScore: 8,
    riskLevel: 'low',
    isFlagged: false
  },
  {
    id: 'txn_003',
    userId: 'user_001',
    merchant: 'Salary Credit - TechCorp',
    merchantCategory: 'Income',
    amount: 95000,
    type: 'credit',
    status: 'completed',
    paymentMethod: 'bankTransfer',
    bankTransferDetails: {
      accountLast4: '7890',
      bankName: 'SBI',
      ifscCode: 'SBIN0001234',
      transferType: 'NEFT'
    },
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    location: 'Mumbai, MH',
    referenceId: 'REF001234569',
    riskScore: 2,
    riskLevel: 'low',
    isFlagged: false
  },
  {
    id: 'txn_004',
    userId: 'user_001',
    merchant: 'Flipkart',
    merchantCategory: 'Shopping',
    amount: 8500,
    type: 'debit',
    status: 'pending',
    paymentMethod: 'card',
    cardDetails: {
      last4: '4242',
      cardBrand: 'Visa',
      cardType: 'credit',
      bankName: 'HDFC Bank'
    },
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    location: 'Mumbai, MH',
    referenceId: 'REF001234570',
    riskScore: 12,
    riskLevel: 'low',
    isFlagged: false
  },
  {
    id: 'txn_005',
    userId: 'user_001',
    merchant: 'Netflix',
    merchantCategory: 'Entertainment',
    amount: 649,
    type: 'debit',
    status: 'completed',
    paymentMethod: 'card',
    cardDetails: {
      last4: '4242',
      cardBrand: 'Visa',
      cardType: 'credit',
      bankName: 'HDFC Bank'
    },
    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    location: 'Mumbai, MH',
    referenceId: 'REF001234571',
    riskScore: 5,
    riskLevel: 'low',
    isFlagged: false
  },
  {
    id: 'txn_006',
    userId: 'user_001',
    merchant: 'Unknown Merchant UAE',
    merchantCategory: 'Unknown',
    amount: 45000,
    type: 'debit',
    status: 'blocked',
    paymentMethod: 'card',
    cardDetails: {
      last4: '4242',
      cardBrand: 'Visa',
      cardType: 'credit',
      bankName: 'HDFC Bank'
    },
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    location: 'Dubai, UAE',
    referenceId: 'REF001234572',
    riskScore: 95,
    riskLevel: 'critical',
    isFlagged: true
  },
  {
    id: 'txn_007',
    userId: 'user_001',
    merchant: 'Zomato',
    merchantCategory: 'Food & Dining',
    amount: 1200,
    type: 'debit',
    status: 'completed',
    paymentMethod: 'upi',
    upiDetails: {
      upiId: 'digamber@paytm',
      upiApp: 'Paytm'
    },
    timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
    location: 'Mumbai, MH',
    referenceId: 'REF001234573',
    riskScore: 6,
    riskLevel: 'low',
    isFlagged: false
  },
  {
    id: 'txn_008',
    userId: 'user_001',
    merchant: 'Electricity Bill',
    merchantCategory: 'Utilities',
    amount: 3500,
    type: 'debit',
    status: 'completed',
    paymentMethod: 'bankTransfer',
    bankTransferDetails: {
      accountLast4: '7890',
      bankName: 'SBI',
      ifscCode: 'SBIN0001234',
      transferType: 'IMPS'
    },
    timestamp: new Date(Date.now() - 96 * 60 * 60 * 1000).toISOString(),
    location: 'Mumbai, MH',
    referenceId: 'REF001234574',
    riskScore: 3,
    riskLevel: 'low',
    isFlagged: false
  },
  {
    id: 'txn_009',
    userId: 'user_001',
    merchant: 'BookMyShow',
    merchantCategory: 'Entertainment',
    amount: 800,
    type: 'debit',
    status: 'failed',
    paymentMethod: 'upi',
    upiDetails: {
      upiId: 'digamber@paytm',
      upiApp: 'Paytm'
    },
    timestamp: new Date(Date.now() - 120 * 60 * 60 * 1000).toISOString(),
    location: 'Mumbai, MH',
    referenceId: 'REF001234575',
    riskScore: 10,
    riskLevel: 'low',
    isFlagged: false
  },
  {
    id: 'txn_010',
    userId: 'user_001',
    merchant: 'Myntra',
    merchantCategory: 'Shopping',
    amount: 5600,
    type: 'debit',
    status: 'completed',
    paymentMethod: 'card',
    cardDetails: {
      last4: '4242',
      cardBrand: 'Visa',
      cardType: 'credit',
      bankName: 'HDFC Bank'
    },
    timestamp: new Date(Date.now() - 144 * 60 * 60 * 1000).toISOString(),
    location: 'Mumbai, MH',
    referenceId: 'REF001234576',
    riskScore: 11,
    riskLevel: 'low',
    isFlagged: false
  }
];

export const fraudLogs = [
  {
    id: 'fraud_001',
    transactionId: 'txn_006',
    userId: 'user_001',
    riskScore: 95,
    riskLevel: 'critical',
    fraudProbability: 94,
    status: 'flagged',
    actionTaken: 'Transaction Blocked',
    riskReasons: [
      'International transaction from unusual location',
      'Amount 1070% above user average',
      'New device detected',
      'Travel speed impossibly high (12,450 km/h)',
      'VPN or proxy detected',
      'Transaction at unusual time (3:47 AM)'
    ],
    triggeredCombinations: [
      'High amount + International + New device',
      'VPN usage + Unusual time + Location change'
    ],
    fraudSignals: {
      isNewDevice: true,
      isVPN: true,
      isSharedDevice: false,
      isUnusualTime: true,
      isAmountSpike: true,
      isInternational: true,
      travelSpeed: 12450,
      deviceFingerprint: 'unknown_device_001',
      ipAddress: '185.220.101.42',
      paymentChannel: 'online'
    },
    detailedScores: {
      distanceScore: 95,
      travelSpeedScore: 98,
      amountSpikeScore: 92,
      newDeviceScore: 85,
      vpnScore: 88,
      velocityScore: 45,
      failedLoginScore: 0,
      unusualTimeScore: 75,
      internationalScore: 90,
      newAccountScore: 15,
      merchantRiskScore: 80,
      sharedDeviceScore: 0,
      countryChangeScore: 95,
      aboveAverageScore: 94,
      highAbsoluteAmountScore: 70
    },
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    investigationNotes: ''
  },
  {
    id: 'fraud_002',
    transactionId: 'txn_011',
    userId: 'user_002',
    riskScore: 78,
    riskLevel: 'high',
    fraudProbability: 76,
    status: 'confirmed_fraud',
    actionTaken: 'Account Locked, Funds Recovered',
    riskReasons: [
      'Multiple failed login attempts (8 in 10 minutes)',
      'Shared device with known fraudster',
      'Amount pattern matches fraud ring',
      'Merchant flagged as high risk'
    ],
    triggeredCombinations: [
      'Failed logins + Shared device',
      'High risk merchant + Amount pattern'
    ],
    fraudSignals: {
      isNewDevice: false,
      isVPN: false,
      isSharedDevice: true,
      isUnusualTime: false,
      isAmountSpike: true,
      isInternational: false,
      travelSpeed: 0,
      deviceFingerprint: 'shared_device_123',
      ipAddress: '103.45.67.89',
      paymentChannel: 'online'
    },
    detailedScores: {
      distanceScore: 10,
      travelSpeedScore: 0,
      amountSpikeScore: 75,
      newDeviceScore: 0,
      vpnScore: 0,
      velocityScore: 65,
      failedLoginScore: 95,
      unusualTimeScore: 20,
      internationalScore: 0,
      newAccountScore: 5,
      merchantRiskScore: 92,
      sharedDeviceScore: 98,
      countryChangeScore: 0,
      aboveAverageScore: 70,
      highAbsoluteAmountScore: 45
    },
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    investigationNotes: 'Confirmed as part of organized fraud ring. Customer notified and funds recovered.'
  },
  {
    id: 'fraud_003',
    transactionId: 'txn_012',
    userId: 'user_003',
    riskScore: 62,
    riskLevel: 'medium',
    fraudProbability: 58,
    status: 'false_positive',
    actionTaken: 'Temporary Hold (Released after verification)',
    riskReasons: [
      'New account (12 days old)',
      'First transaction above ₹10,000',
      'Transaction from new city'
    ],
    triggeredCombinations: [
      'New account + High amount'
    ],
    fraudSignals: {
      isNewDevice: true,
      isVPN: false,
      isSharedDevice: false,
      isUnusualTime: false,
      isAmountSpike: true,
      isInternational: false,
      travelSpeed: 45,
      deviceFingerprint: 'device_456',
      ipAddress: '115.98.23.45',
      paymentChannel: 'mobile_app'
    },
    detailedScores: {
      distanceScore: 55,
      travelSpeedScore: 15,
      amountSpikeScore: 85,
      newDeviceScore: 70,
      vpnScore: 0,
      velocityScore: 30,
      failedLoginScore: 0,
      unusualTimeScore: 10,
      internationalScore: 0,
      newAccountScore: 88,
      merchantRiskScore: 25,
      sharedDeviceScore: 0,
      countryChangeScore: 20,
      aboveAverageScore: 80,
      highAbsoluteAmountScore: 35
    },
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    investigationNotes: 'Customer verified via phone. Legitimate transaction for business travel.'
  },
  {
    id: 'fraud_004',
    transactionId: 'txn_013',
    userId: 'user_004',
    riskScore: 85,
    riskLevel: 'high',
    fraudProbability: 82,
    status: 'flagged',
    actionTaken: 'Under Review',
    riskReasons: [
      'Velocity: 6 transactions in 15 minutes',
      'Each transaction just below reporting threshold',
      'Multiple different merchants',
      'IP address changed 3 times'
    ],
    triggeredCombinations: [
      'High velocity + Threshold splitting',
      'Multiple IPs + Multiple merchants'
    ],
    fraudSignals: {
      isNewDevice: false,
      isVPN: true,
      isSharedDevice: false,
      isUnusualTime: true,
      isAmountSpike: false,
      isInternational: false,
      travelSpeed: 0,
      deviceFingerprint: 'device_789',
      ipAddress: '45.67.89.123',
      paymentChannel: 'online'
    },
    detailedScores: {
      distanceScore: 0,
      travelSpeedScore: 0,
      amountSpikeScore: 40,
      newDeviceScore: 0,
      vpnScore: 85,
      velocityScore: 98,
      failedLoginScore: 15,
      unusualTimeScore: 80,
      internationalScore: 0,
      newAccountScore: 0,
      merchantRiskScore: 60,
      sharedDeviceScore: 0,
      countryChangeScore: 0,
      aboveAverageScore: 35,
      highAbsoluteAmountScore: 30
    },
    timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
    investigationNotes: 'Suspicious pattern detected. Awaiting customer contact.'
  },
  {
    id: 'fraud_005',
    transactionId: 'txn_014',
    userId: 'user_005',
    riskScore: 52,
    riskLevel: 'medium',
    fraudProbability: 48,
    status: 'flagged',
    actionTaken: 'Additional Verification Required',
    riskReasons: [
      'Transaction at 2:30 AM (unusual for user)',
      'Amount 285% above average',
      'Different device from usual'
    ],
    triggeredCombinations: [],
    fraudSignals: {
      isNewDevice: true,
      isVPN: false,
      isSharedDevice: false,
      isUnusualTime: true,
      isAmountSpike: true,
      isInternational: false,
      travelSpeed: 0,
      deviceFingerprint: 'device_new_001',
      ipAddress: '122.45.67.89',
      paymentChannel: 'mobile_app'
    },
    detailedScores: {
      distanceScore: 0,
      travelSpeedScore: 0,
      amountSpikeScore: 68,
      newDeviceScore: 65,
      vpnScore: 0,
      velocityScore: 20,
      failedLoginScore: 0,
      unusualTimeScore: 72,
      internationalScore: 0,
      newAccountScore: 0,
      merchantRiskScore: 15,
      sharedDeviceScore: 0,
      countryChangeScore: 0,
      aboveAverageScore: 65,
      highAbsoluteAmountScore: 25
    },
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    investigationNotes: ''
  }
];

export const upiContacts = [
  {
    id: 'contact_001',
    name: 'Rahul Kumar',
    upiId: 'rahul@paytm',
    avatar: 'RK',
    bank: 'ICICI Bank'
  },
  {
    id: 'contact_002',
    name: 'Priya Sharma',
    upiId: 'priya@oksbi',
    avatar: 'PS',
    bank: 'SBI'
  },
  {
    id: 'contact_003',
    name: 'Amit Patel',
    upiId: 'amit@ybl',
    avatar: 'AP',
    bank: 'Yes Bank'
  }
];

export const spendingData = [
  { day: 'Mon', amount: 4500 },
  { day: 'Tue', amount: 2800 },
  { day: 'Wed', amount: 6200 },
  { day: 'Thu', amount: 3100 },
  { day: 'Fri', amount: 8900 },
  { day: 'Sat', amount: 5400 },
  { day: 'Sun', amount: 1200 }
];

export const fraudTrendData = [
  { day: 'Mon', total: 1450, flagged: 42 },
  { day: 'Tue', total: 1680, flagged: 38 },
  { day: 'Wed', total: 1920, flagged: 55 },
  { day: 'Thu', total: 1750, flagged: 48 },
  { day: 'Fri', total: 2100, flagged: 72 },
  { day: 'Sat', total: 1880, flagged: 51 },
  { day: 'Sun', total: 1420, flagged: 35 }
];

export const allUsers = [
  currentUser,
  {
    id: 'user_002',
    name: 'Rajesh Kumar',
    email: 'rajesh.k@email.com',
    phone: '+91 98123 45678',
    balance: 45200,
    currency: 'INR',
    totalTransactions: 32,
    averageTransactionAmount: 3100,
    accountAgeDays: 420,
    isLocked: true,
    avatar: 'RK'
  },
  {
    id: 'user_003',
    name: 'Anita Desai',
    email: 'anita.d@email.com',
    phone: '+91 97654 32109',
    balance: 128000,
    currency: 'INR',
    totalTransactions: 89,
    averageTransactionAmount: 5800,
    accountAgeDays: 12,
    isLocked: false,
    avatar: 'AD'
  },
  {
    id: 'user_004',
    name: 'Vikram Singh',
    email: 'vikram.s@email.com',
    phone: '+91 99887 76655',
    balance: 92300,
    currency: 'INR',
    totalTransactions: 156,
    averageTransactionAmount: 4900,
    accountAgeDays: 680,
    isLocked: false,
    avatar: 'VS'
  },
  {
    id: 'user_005',
    name: 'Meera Nair',
    email: 'meera.n@email.com',
    phone: '+91 98456 12345',
    balance: 67800,
    currency: 'INR',
    totalTransactions: 64,
    averageTransactionAmount: 2800,
    accountAgeDays: 195,
    isLocked: false,
    avatar: 'MN'
  }
];

export const merchants = [
  {
    id: 'merchant_001',
    name: 'Unknown Merchant UAE',
    category: 'Unknown',
    riskScore: 92,
    fraudReports: 47,
    isHighRisk: true,
    isActive: false
  },
  {
    id: 'merchant_002',
    name: 'Crypto Exchange XYZ',
    category: 'Financial',
    riskScore: 78,
    fraudReports: 23,
    isHighRisk: true,
    isActive: true
  },
  {
    id: 'merchant_003',
    name: 'Amazon India',
    category: 'Shopping',
    riskScore: 12,
    fraudReports: 2,
    isHighRisk: false,
    isActive: true
  },
  {
    id: 'merchant_004',
    name: 'Swiggy',
    category: 'Food & Dining',
    riskScore: 8,
    fraudReports: 0,
    isHighRisk: false,
    isActive: true
  },
  {
    id: 'merchant_005',
    name: 'Offshore Gaming Site',
    category: 'Gaming',
    riskScore: 85,
    fraudReports: 156,
    isHighRisk: true,
    isActive: false
  }
];

// Geographic fraud data for heatmap
export const geographicFraudData = [
  {
    id: 'state_001',
    state: 'Maharashtra',
    stateCode: 'MH',
    fraudCases: 4280,
    totalTransactions: 285000,
    fraudRate: 1.5,
    riskLevel: 'high',
    topCities: [
      { name: 'Mumbai', cases: 2840, riskScore: 78 },
      { name: 'Pune', cases: 890, riskScore: 62 },
      { name: 'Nagpur', cases: 550, riskScore: 48 }
    ],
    fraudTypes: { cardFraud: 45, upiScam: 32, phishing: 18, identityTheft: 5 },
    trend: 'increasing',
    avgLoss: 28500
  },
  {
    id: 'state_002',
    state: 'Delhi NCR',
    stateCode: 'DL',
    fraudCases: 3850,
    totalTransactions: 220000,
    fraudRate: 1.75,
    riskLevel: 'critical',
    topCities: [
      { name: 'New Delhi', cases: 2100, riskScore: 85 },
      { name: 'Gurgaon', cases: 980, riskScore: 72 },
      { name: 'Noida', cases: 770, riskScore: 68 }
    ],
    fraudTypes: { cardFraud: 38, upiScam: 40, phishing: 15, identityTheft: 7 },
    trend: 'increasing',
    avgLoss: 35200
  },
  {
    id: 'state_003',
    state: 'Karnataka',
    stateCode: 'KA',
    fraudCases: 2950,
    totalTransactions: 195000,
    fraudRate: 1.51,
    riskLevel: 'high',
    topCities: [
      { name: 'Bengaluru', cases: 2450, riskScore: 75 },
      { name: 'Mysuru', cases: 320, riskScore: 42 },
      { name: 'Mangaluru', cases: 180, riskScore: 38 }
    ],
    fraudTypes: { cardFraud: 42, upiScam: 35, phishing: 16, identityTheft: 7 },
    trend: 'stable',
    avgLoss: 31800
  },
  {
    id: 'state_004',
    state: 'Tamil Nadu',
    stateCode: 'TN',
    fraudCases: 2180,
    totalTransactions: 178000,
    fraudRate: 1.22,
    riskLevel: 'medium',
    topCities: [
      { name: 'Chennai', cases: 1580, riskScore: 65 },
      { name: 'Coimbatore', cases: 380, riskScore: 45 },
      { name: 'Madurai', cases: 220, riskScore: 38 }
    ],
    fraudTypes: { cardFraud: 35, upiScam: 38, phishing: 20, identityTheft: 7 },
    trend: 'decreasing',
    avgLoss: 24500
  },
  {
    id: 'state_005',
    state: 'Gujarat',
    stateCode: 'GJ',
    fraudCases: 1920,
    totalTransactions: 165000,
    fraudRate: 1.16,
    riskLevel: 'medium',
    topCities: [
      { name: 'Ahmedabad', cases: 1120, riskScore: 58 },
      { name: 'Surat', cases: 520, riskScore: 52 },
      { name: 'Vadodara', cases: 280, riskScore: 42 }
    ],
    fraudTypes: { cardFraud: 30, upiScam: 42, phishing: 22, identityTheft: 6 },
    trend: 'stable',
    avgLoss: 22800
  },
  {
    id: 'state_006',
    state: 'West Bengal',
    stateCode: 'WB',
    fraudCases: 2450,
    totalTransactions: 142000,
    fraudRate: 1.72,
    riskLevel: 'high',
    topCities: [
      { name: 'Kolkata', cases: 1980, riskScore: 72 },
      { name: 'Howrah', cases: 280, riskScore: 48 },
      { name: 'Durgapur', cases: 190, riskScore: 42 }
    ],
    fraudTypes: { cardFraud: 28, upiScam: 48, phishing: 18, identityTheft: 6 },
    trend: 'increasing',
    avgLoss: 19800
  },
  {
    id: 'state_007',
    state: 'Telangana',
    stateCode: 'TS',
    fraudCases: 2680,
    totalTransactions: 158000,
    fraudRate: 1.69,
    riskLevel: 'high',
    topCities: [
      { name: 'Hyderabad', cases: 2320, riskScore: 76 },
      { name: 'Warangal', cases: 220, riskScore: 42 },
      { name: 'Nizamabad', cases: 140, riskScore: 35 }
    ],
    fraudTypes: { cardFraud: 40, upiScam: 36, phishing: 17, identityTheft: 7 },
    trend: 'stable',
    avgLoss: 29500
  },
  {
    id: 'state_008',
    state: 'Rajasthan',
    stateCode: 'RJ',
    fraudCases: 1580,
    totalTransactions: 128000,
    fraudRate: 1.23,
    riskLevel: 'medium',
    topCities: [
      { name: 'Jaipur', cases: 920, riskScore: 55 },
      { name: 'Jodhpur', cases: 380, riskScore: 42 },
      { name: 'Udaipur', cases: 280, riskScore: 38 }
    ],
    fraudTypes: { cardFraud: 25, upiScam: 45, phishing: 24, identityTheft: 6 },
    trend: 'stable',
    avgLoss: 18500
  },
  {
    id: 'state_009',
    state: 'Uttar Pradesh',
    stateCode: 'UP',
    fraudCases: 3120,
    totalTransactions: 205000,
    fraudRate: 1.52,
    riskLevel: 'high',
    topCities: [
      { name: 'Lucknow', cases: 1280, riskScore: 68 },
      { name: 'Kanpur', cases: 720, riskScore: 55 },
      { name: 'Varanasi', cases: 580, riskScore: 48 },
      { name: 'Agra', cases: 540, riskScore: 45 }
    ],
    fraudTypes: { cardFraud: 22, upiScam: 52, phishing: 20, identityTheft: 6 },
    trend: 'increasing',
    avgLoss: 16800
  },
  {
    id: 'state_010',
    state: 'Kerala',
    stateCode: 'KL',
    fraudCases: 980,
    totalTransactions: 115000,
    fraudRate: 0.85,
    riskLevel: 'low',
    topCities: [
      { name: 'Kochi', cases: 480, riskScore: 42 },
      { name: 'Thiruvananthapuram', cases: 320, riskScore: 38 },
      { name: 'Kozhikode', cases: 180, riskScore: 32 }
    ],
    fraudTypes: { cardFraud: 35, upiScam: 30, phishing: 28, identityTheft: 7 },
    trend: 'decreasing',
    avgLoss: 21200
  },
  {
    id: 'state_011',
    state: 'Punjab',
    stateCode: 'PB',
    fraudCases: 1420,
    totalTransactions: 98000,
    fraudRate: 1.45,
    riskLevel: 'medium',
    topCities: [
      { name: 'Ludhiana', cases: 620, riskScore: 58 },
      { name: 'Chandigarh', cases: 480, riskScore: 52 },
      { name: 'Amritsar', cases: 320, riskScore: 45 }
    ],
    fraudTypes: { cardFraud: 32, upiScam: 38, phishing: 22, identityTheft: 8 },
    trend: 'stable',
    avgLoss: 24500
  },
  {
    id: 'state_012',
    state: 'Madhya Pradesh',
    stateCode: 'MP',
    fraudCases: 1680,
    totalTransactions: 112000,
    fraudRate: 1.5,
    riskLevel: 'medium',
    topCities: [
      { name: 'Indore', cases: 780, riskScore: 55 },
      { name: 'Bhopal', cases: 580, riskScore: 48 },
      { name: 'Gwalior', cases: 320, riskScore: 42 }
    ],
    fraudTypes: { cardFraud: 28, upiScam: 44, phishing: 22, identityTheft: 6 },
    trend: 'stable',
    avgLoss: 17800
  }
];

// Fraud type definitions with colors
export const fraudTypeDefinitions = {
  cardFraud: { label: 'Card Fraud', color: '#ef4444', description: 'Unauthorized card transactions' },
  upiScam: { label: 'UPI Scam', color: '#f97316', description: 'Fraudulent UPI payments' },
  phishing: { label: 'Phishing', color: '#eab308', description: 'Social engineering attacks' },
  identityTheft: { label: 'Identity Theft', color: '#8b5cf6', description: 'Account takeover fraud' }
};

// Time-based fraud patterns
export const hourlyFraudPatterns = [
  { hour: '00:00', cases: 42, avgAmount: 15200 },
  { hour: '02:00', cases: 28, avgAmount: 22800 },
  { hour: '04:00', cases: 18, avgAmount: 31200 },
  { hour: '06:00', cases: 35, avgAmount: 12500 },
  { hour: '08:00', cases: 68, avgAmount: 8900 },
  { hour: '10:00', cases: 125, avgAmount: 18500 },
  { hour: '12:00', cases: 156, avgAmount: 21200 },
  { hour: '14:00', cases: 142, avgAmount: 19800 },
  { hour: '16:00', cases: 178, avgAmount: 24500 },
  { hour: '18:00', cases: 195, avgAmount: 28900 },
  { hour: '20:00', cases: 168, avgAmount: 32500 },
  { hour: '22:00', cases: 98, avgAmount: 25800 }
];

// Real-time alerts data
export const realtimeAlerts = [
  {
    id: 'alert_001',
    type: 'critical',
    title: 'Unusual spike in fraud attempts',
    description: 'Delhi NCR region showing 45% increase in card fraud in last hour',
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    region: 'Delhi NCR',
    isRead: false,
    actionRequired: true
  },
  {
    id: 'alert_002',
    type: 'warning',
    title: 'New phishing campaign detected',
    description: 'Multiple users reporting fake bank SMS messages targeting HDFC customers',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    region: 'Pan India',
    isRead: false,
    actionRequired: true
  },
  {
    id: 'alert_003',
    type: 'info',
    title: 'ML Model updated',
    description: 'Fraud detection model v2.3.1 deployed with improved accuracy',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    region: null,
    isRead: true,
    actionRequired: false
  },
  {
    id: 'alert_004',
    type: 'critical',
    title: 'High-value fraud blocked',
    description: '₹4,50,000 suspicious transfer attempt blocked from Mumbai',
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    region: 'Maharashtra',
    isRead: false,
    actionRequired: true
  },
  {
    id: 'alert_005',
    type: 'warning',
    title: 'Merchant flagged for review',
    description: 'Crypto Exchange XYZ showing unusual transaction patterns',
    timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    region: 'Karnataka',
    isRead: true,
    actionRequired: false
  }
];

// ML Model performance metrics
export const mlModelMetrics = {
  currentVersion: 'v2.3.1',
  lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  accuracy: 94.7,
  precision: 92.3,
  recall: 89.5,
  f1Score: 90.8,
  falsePositiveRate: 3.2,
  falseNegativeRate: 5.8,
  avgResponseTime: 45,
  totalPredictions: 2850000,
  fraudsCaught: 24580,
  fraudsMissed: 1420,
  historicalPerformance: [
    { version: 'v2.0.0', accuracy: 88.2, date: '2025-08' },
    { version: 'v2.1.0', accuracy: 90.5, date: '2025-10' },
    { version: 'v2.2.0', accuracy: 92.8, date: '2025-12' },
    { version: 'v2.3.0', accuracy: 94.1, date: '2026-01' },
    { version: 'v2.3.1', accuracy: 94.7, date: '2026-02' }
  ],
  riskThresholds: {
    low: { min: 0, max: 30 },
    medium: { min: 31, max: 60 },
    high: { min: 61, max: 80 },
    critical: { min: 81, max: 100 }
  }
};
