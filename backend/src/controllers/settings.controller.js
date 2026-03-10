const { getSettings, updateSettings } = require('../services/settings.service');

const getAppSettings = (req, res) => {
  try {
    const settings = getSettings();
    res.json({ success: true, data: settings });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Ошибка получения настроек' });
  }
};

const updateAppSettings = (req, res) => {
  try {
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
    const settings = updateSettings(updates);
    res.json({ success: true, data: settings });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Ошибка обновления настроек' });
  }
};

module.exports = { getAppSettings, updateAppSettings };
