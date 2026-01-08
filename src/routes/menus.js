const express = require('express');
const menuService = require('../services/menuService');

const router = express.Router({ mergeParams: true });

// Restoran menüsünü listele
router.get('/', async (req, res) => {
  try {
    const menus = await menuService.getMenusByRestaurantId(req.params.restaurantId);
    res.json({ success: true, data: menus });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Menü öğesini getir
router.get('/:id', async (req, res) => {
  try {
    const menu = await menuService.getMenuItemById(req.params.id);
    if (!menu) {
      return res.status(404).json({ success: false, error: 'Menü öğesi bulunamadı' });
    }
    res.json({ success: true, data: menu });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Yeni menü öğesi ekle
router.post('/', async (req, res) => {
  try {
    const { itemName, description, price } = req.body;
    const menu = await menuService.createMenuItem(req.params.restaurantId, itemName, description, price);
    res.status(201).json({ success: true, data: menu });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Menü öğesini güncelle
router.put('/:id', async (req, res) => {
  try {
    const { itemName, description, price } = req.body;
    const menu = await menuService.updateMenuItem(req.params.id, itemName, description, price);
    res.json({ success: true, data: menu });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Menü öğesini sil
router.delete('/:id', async (req, res) => {
  try {
    const result = await menuService.deleteMenuItem(req.params.id);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;
