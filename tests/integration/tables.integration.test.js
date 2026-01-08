const request = require('supertest');
const { app } = require('../../src/app');

describe('API Integration Tests - Tables', () => {
  let restaurantId;

  beforeAll(async () => {
    const response = await request(app)
      .post('/api/restaurants')
      .send({
        name: 'Test Restaurant for Tables',
        address: 'Test Address'
      });
    restaurantId = response.body.data.id;
  });

  describe('POST /api/restaurants/:id/tables', () => {
    test('REQ-035: Restorana yeni masa ekleme', async () => {
      const response = await request(app)
        .post(`/api/restaurants/${restaurantId}/tables`)
        .send({
          tableNumber: 1,
          capacity: 4
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.table_number).toBe(1);
    });
  });

  describe('GET /api/restaurants/:id/tables', () => {
    test('REQ-036: Restorandaki masaları listeleme', async () => {
      const response = await request(app)
        .get(`/api/restaurants/${restaurantId}/tables`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('PUT /api/tables/:id/status', () => {
    test('REQ-037: Masa durumunu güncelleme', async () => {
      // Önce masa oluştur
      const createResponse = await request(app)
        .post(`/api/restaurants/${restaurantId}/tables`)
        .send({
          tableNumber: 5,
          capacity: 2
        });

      const tableId = createResponse.body.data.id;

      // Durumunu güncelle
      const response = await request(app)
        .put(`/api/tables/${tableId}/status`)
        .send({
          status: 'occupied'
        })
        .expect(200);

      expect(response.body.data.status).toBe('occupied');
    });

    test('REQ-038: Geçersiz masa durumu 400 döner', async () => {
      const createResponse = await request(app)
        .post(`/api/restaurants/${restaurantId}/tables`)
        .send({
          tableNumber: 6,
          capacity: 2
        });

      const tableId = createResponse.body.data.id;

      const response = await request(app)
        .put(`/api/tables/${tableId}/status`)
        .send({
          status: 'invalid_status'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });
});
