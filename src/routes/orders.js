const express = require('express');
const orderService = require('../services/orderService');

const router = express.Router();

// Tüm siparişleri listele
router.get('/', async (req, res) => {
  try {
    const orders = await orderService.getAllOrders();
    res.json({ success: true, data: orders || [] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Sipariş detaylarını getir
router.get('/:id', async (req, res) => {
  try {
    const order = await orderService.getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, error: 'Sipariş bulunamadı' });
    }
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Yeni sipariş oluştur
router.post('/', async (req, res) => {
  try {
    const { restaurantId, tableId, menuId, quantity } = req.body;
    const order = await orderService.createOrder(restaurantId, tableId, menuId, quantity);
    res.status(201).json({ success: true, data: order });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Sipariş durumunu güncelle
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await orderService.updateOrderStatus(req.params.id, status);
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Siparişi tamamla
router.put('/:id/complete', async (req, res) => {
  try {
    const order = await orderService.completeOrder(req.params.id);
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;
