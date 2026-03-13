const { getSettings, updateSettings } = require('../services/settings.service');
const { asyncHandler } = require('../middlewares/errorHandler.middleware');

const getAppSettings = asyncHandler(async (req, res) => {
  const settings = await getSettings();
  res.json({ success: true, data: settings });
});

const updateAppSettings = asyncHandler(async (req, res) => {
  const allowed = ['min_order_amount', 'delivery_fee', 'free_delivery_from'];
  const updates = {};

  for (const key of allowed) {
    if (req.body[key] !== undefined) {
      const val = Number(req.body[key]);
      if (isNaN(val) || val < 0) {
        return res.status(400).json({ success: false, message: `Некорректное значение для ${key}` });
      }
      updates[key] = val;
    }
  }

  const settings = await updateSettings(updates);
  res.json({ success: true, data: settings });
});

module.exports = { getAppSettings, updateAppSettings };
