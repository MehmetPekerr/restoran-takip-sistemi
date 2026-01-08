const express = require('express');
const tableService = require('../services/tableService');

const router = express.Router({ mergeParams: true });

// Restoranın masalarını listele
router.get('/', async (req, res) => {
  try {
    const tables = await tableService.getTablesByRestaurantId(req.params.restaurantId);
    res.json({ success: true, data: tables });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Masa detaylarını getir
router.get('/:id', async (req, res) => {
  try {
    const table = await tableService.getTableById(req.params.id);
    if (!table) {
      return res.status(404).json({ success: false, error: 'Masa bulunamadı' });
    }
    res.json({ success: true, data: table });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Yeni masa ekle
router.post('/', async (req, res) => {
  try {
    const { tableNumber, capacity } = req.body;
    const table = await tableService.createTable(req.params.restaurantId, tableNumber, capacity);
    res.status(201).json({ success: true, data: table });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Masa durumunu güncelle
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const table = await tableService.updateTableStatus(req.params.id, status);
    res.json({ success: true, data: table });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Boş masaları listele
router.get('/available/list', async (req, res) => {
  try {
    const tables = await tableService.getAvailableTables(req.params.restaurantId);
    res.json({ success: true, data: tables });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
