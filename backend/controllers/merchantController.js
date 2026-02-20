import Merchant from "../models/Merchant.js";

// GET /api/merchants — Admin only
export const getAllMerchants = async (req, res, next) => {
  try {
    const merchants = await Merchant.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: merchants.length, data: { merchants } });
  } catch (err) {
    next(err);
  }
};

// GET /api/merchants/:id
export const getMerchantById = async (req, res, next) => {
  try {
    const merchant = await Merchant.findById(req.params.id);
    if (!merchant) return res.status(404).json({ success: false, message: "Merchant not found." });
    res.status(200).json({ success: true, data: { merchant } });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/merchants/:id/risk-score — Admin only
export const updateRiskScore = async (req, res, next) => {
  try {
    const { riskScore } = req.body;
    if (riskScore === undefined || riskScore < 0 || riskScore > 1) {
      return res.status(400).json({ success: false, message: "riskScore must be between 0 and 1." });
    }

    const merchant = await Merchant.findByIdAndUpdate(req.params.id, { riskScore }, { new: true });
    if (!merchant) return res.status(404).json({ success: false, message: "Merchant not found." });
    res.status(200).json({ success: true, data: { merchant } });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/merchants/:id/deactivate — Admin only
export const deactivateMerchant = async (req, res, next) => {
  try {
    const merchant = await Merchant.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!merchant) return res.status(404).json({ success: false, message: "Merchant not found." });
    res.status(200).json({ success: true, message: "Merchant deactivated.", data: { merchant } });
  } catch (err) {
    next(err);
  }
};

// GET /api/merchants/high-risk — Admin only
export const getHighRiskMerchants = async (req, res, next) => {
  try {
    const merchants = await Merchant.find({
      $or: [{ riskScore: { $gte: 0.7 } }, { isHighRiskCategory: true }],
    });
    res.status(200).json({ success: true, count: merchants.length, data: { merchants } });
  } catch (err) {
    next(err);
  }
};
