const express = require('express');
const restaurantService = require('../services/restaurantService');

const router = express.Router();

// Tüm restoranları listele
router.get('/', async (req, res) => {
  try {
    const restaurants = await restaurantService.getAllRestaurants();
    res.json({ success: true, data: restaurants });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Belirli restoranı getir
router.get('/:id', async (req, res) => {
  try {
    const restaurant = await restaurantService.getRestaurantById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ success: false, error: 'Restoran bulunamadı' });
    }
    res.json({ success: true, data: restaurant });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Yeni restoran ekle
router.post('/', async (req, res) => {
  try {
    const { name, address, phone } = req.body;
    const restaurant = await restaurantService.createRestaurant(name, address, phone);
    res.status(201).json({ success: true, data: restaurant });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Restoranı güncelle
router.put('/:id', async (req, res) => {
  try {
    const { name, address, phone } = req.body;
    const restaurant = await restaurantService.updateRestaurant(req.params.id, name, address, phone);
    res.json({ success: true, data: restaurant });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Restoranı sil
router.delete('/:id', async (req, res) => {
  try {
    const result = await restaurantService.deleteRestaurant(req.params.id);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;
