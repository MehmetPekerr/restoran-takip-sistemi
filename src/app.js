const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const restaurantRoutes = require('./routes/restaurants');
const tableRoutes = require('./routes/tables');
const menuRoutes = require('./routes/menus');
const orderRoutes = require('./routes/orders');
const tableService = require('./services/tableService');
const menuService = require('./services/menuService');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Statik dosyalar ve ana sayfa
const publicDir = path.join(__dirname, 'public');
app.use(express.static(publicDir));
app.get('/', (req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/restaurants/:restaurantId/tables', tableRoutes);
app.use('/api/restaurants/:restaurantId/menus', menuRoutes);
app.use('/api/orders', orderRoutes);

// Üst seviye yardımcı endpoint'ler (README ile uyumlu)
app.put('/api/tables/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const table = await tableService.updateTableStatus(req.params.id, status);
    res.json({ success: true, data: table });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

app.delete('/api/menus/:id', async (req, res) => {
  try {
    const result = await menuService.deleteMenuItem(req.params.id);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Endpoint bulunamadı' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Sunucu hatası' });
});

const PORT = process.env.PORT || 3000;

let server = null;
if (process.env.NODE_ENV !== 'test' && require.main === module) {
  server = app.listen(PORT, () => {
    if (process.env.NODE_ENV !== 'test') {
      console.log(`Restoran Takip Sistemi sunucusu ${PORT} portunda çalışıyor`);
    }
  });
}

module.exports = { app, server };
