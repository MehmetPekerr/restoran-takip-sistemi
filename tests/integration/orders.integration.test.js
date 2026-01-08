const request = require('supertest');
const { app } = require('../../src/app');

describe('API Integration Tests - Orders', () => {
  let restaurantId, tableId, menuId;

  beforeAll(async () => {
    // Restoran oluştur
    const restaurantResponse = await request(app)
      .post('/api/restaurants')
      .send({
        name: 'Test Restaurant for Orders',
        address: 'Test Address'
      });
    restaurantId = restaurantResponse.body.data.id;

    // Masa oluştur
    const tableResponse = await request(app)
      .post(`/api/restaurants/${restaurantId}/tables`)
      .send({
        tableNumber: 1,
        capacity: 4
      });
    tableId = tableResponse.body.data.id;

    // Menü öğesi oluştur
    const menuResponse = await request(app)
      .post(`/api/restaurants/${restaurantId}/menus`)
      .send({
        itemName: 'Pizza',
        price: 25.00
      });
    menuId = menuResponse.body.data.id;
  });

  describe('GET /api/orders', () => {
    test('REQ-042: Tüm siparişleri getirme', async () => {
      const response = await request(app)
        .get('/api/orders')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('POST /api/orders', () => {
    test('REQ-043: Yeni sipariş oluşturma', async () => {
      const response = await request(app)
        .post('/api/orders')
        .send({
          restaurantId,
          tableId,
          menuId,
          quantity: 2
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.quantity).toBe(2);
      expect(response.body.data.status).toBe('pending');
    });

    test('REQ-044: Eksik verilerle sipariş oluşturma başarısız', async () => {
      const response = await request(app)
        .post('/api/orders')
        .send({
          restaurantId,
          tableId
          // menuId eksik
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/orders/:id/status', () => {
    test('REQ-045: Sipariş durumunu güncelleme', async () => {
      const createResponse = await request(app)
        .post('/api/orders')
        .send({
          restaurantId,
          tableId,
          menuId,
          quantity: 1
        });

      const orderId = createResponse.body.data.id;

      const response = await request(app)
        .put(`/api/orders/${orderId}/status`)
        .send({
          status: 'preparing'
        })
        .expect(200);

      expect(response.body.data.status).toBe('preparing');
    });

    test('REQ-046: Geçersiz sipariş durumu 400 döner', async () => {
      const createResponse = await request(app)
        .post('/api/orders')
        .send({
          restaurantId,
          tableId,
          menuId,
          quantity: 1
        });

      const orderId = createResponse.body.data.id;

      const response = await request(app)
        .put(`/api/orders/${orderId}/status`)
        .send({
          status: 'invalid_status'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/orders/:id/complete', () => {
    test('REQ-047: Siparişi tamamlama', async () => {
      const createResponse = await request(app)
        .post('/api/orders')
        .send({
          restaurantId,
          tableId,
          menuId,
          quantity: 1
        });

      const orderId = createResponse.body.data.id;

      const response = await request(app)
        .put(`/api/orders/${orderId}/complete`)
        .expect(200);

      expect(response.body.data.status).toBe('completed');
    });
  });

  describe('GET /api/orders/:id', () => {
    test('REQ-048: Sipariş detaylarını getirme', async () => {
      const createResponse = await request(app)
        .post('/api/orders')
        .send({
          restaurantId,
          tableId,
          menuId,
          quantity: 1
        });

      const orderId = createResponse.body.data.id;

      const response = await request(app)
        .get(`/api/orders/${orderId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(orderId);
    });
  });
});

describe('Health Check', () => {
  test('REQ-049: Health endpoint açık', async () => {
    const response = await request(app)
      .get('/health')
      .expect(200);

    expect(response.body).toHaveProperty('status');
    expect(response.body.status).toBe('OK');
  });
});
