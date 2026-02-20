import Device from "../models/Device.js";
import User from "../models/User.js";

// POST /api/devices/register
export const registerDevice = async (req, res, next) => {
  try {
    const { deviceId, browser, os, deviceType, userAgent, ipAddress, isVPN, isProxy, isTor, isp, country } = req.body;

    let device = await Device.findOne({ deviceId });

    if (device) {
      if (!device.linkedUserIds.includes(req.user._id)) {
        device.linkedUserIds.push(req.user._id);
      }
      device.ipAddress = ipAddress || device.ipAddress;
      device.isVPN = isVPN ?? device.isVPN;
      device.isProxy = isProxy ?? device.isProxy;
      device.isTor = isTor ?? device.isTor;
      device.lastUsedAt = new Date();
      await device.save();
    } else {
      device = await Device.create({
        userId: req.user._id,
        deviceId,
        browser,
        os,
        deviceType,
        userAgent,
        ipAddress,
        isVPN: isVPN || false,
        isProxy: isProxy || false,
        isTor: isTor || false,
        isp,
        country,
        linkedUserIds: [req.user._id],
      });

      if (!req.user.knownDevices.includes(deviceId)) {
        await User.findByIdAndUpdate(req.user._id, { $addToSet: { knownDevices: deviceId } });
      }
    }

    res.status(201).json({ success: true, data: { device } });
  } catch (err) {
    next(err);
  }
};

// GET /api/devices — Admin only
export const getAllDevices = async (req, res, next) => {
  try {
    const devices = await Device.find().populate("userId", "name email").sort({ lastUsedAt: -1 });
    res.status(200).json({ success: true, count: devices.length, data: { devices } });
  } catch (err) {
    next(err);
  }
};

// GET /api/devices/shared — Admin only
export const getSharedDevices = async (req, res, next) => {
  try {
    const devices = await Device.find({ isSharedDevice: true }).populate("linkedUserIds", "name email");
    res.status(200).json({ success: true, count: devices.length, data: { devices } });
  } catch (err) {
    next(err);
  }
};

// GET /api/devices/my
export const getMyDevices = async (req, res, next) => {
  try {
    const devices = await Device.find({ userId: req.user._id });
    res.status(200).json({ success: true, count: devices.length, data: { devices } });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/devices/:deviceId/trust
export const trustDevice = async (req, res, next) => {
  try {
    const device = await Device.findOne({ deviceId: req.params.deviceId, userId: req.user._id });
    if (!device) return res.status(404).json({ success: false, message: "Device not found." });

    device.isTrusted = true;
    await device.save();
    res.status(200).json({ success: true, data: { device } });
  } catch (err) {
    next(err);
  }
};
