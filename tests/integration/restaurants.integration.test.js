const request = require('supertest');
const { app } = require('../../src/app');

describe('API Integration Tests - Restaurants', () => {
  
  describe('GET /api/restaurants', () => {
    test('REQ-028: Tüm restoranları başarıyla getirme', async () => {
      const response = await request(app)
        .get('/api/restaurants')
        .expect(200);

      expect(response.body).toHaveProperty('success');
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('POST /api/restaurants', () => {
    test('REQ-029: Yeni restoran başarıyla oluşturma', async () => {
      const response = await request(app)
        .post('/api/restaurants')
        .send({
          name: 'Test Restoran',
          address: 'Test Sokak No:1',
          phone: '5551234567'
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('name');
      expect(response.body.data.name).toBe('Test Restoran');
    });

    test('REQ-030: Eksik verilerle restoran oluşturma başarısız olur', async () => {
      const response = await request(app)
        .post('/api/restaurants')
        .send({
          name: 'Test Restoran'
          // address eksik
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/restaurants/:id', () => {
    test('REQ-031: Belirli restoranı ID ile getirme', async () => {
      // Önce bir restoran oluştur
      const createResponse = await request(app)
        .post('/api/restaurants')
        .send({
          name: 'Get Test',
          address: 'Test Address'
        });

      const restaurantId = createResponse.body.data.id;

      // Sonra onu getir
      const response = await request(app)
        .get(`/api/restaurants/${restaurantId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('Get Test');
    });

    test('REQ-032: Olmayan restoran ID\'si 404 döner', async () => {
      const response = await request(app)
        .get('/api/restaurants/99999')
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/restaurants/:id', () => {
    test('REQ-033: Restoranı başarıyla güncelleme', async () => {
      const createResponse = await request(app)
        .post('/api/restaurants')
        .send({
          name: 'Update Test',
          address: 'Old Address'
        });

      const restaurantId = createResponse.body.data.id;

      const response = await request(app)
        .put(`/api/restaurants/${restaurantId}`)
        .send({
          name: 'Updated Name',
          address: 'New Address'
        })
        .expect(200);

      expect(response.body.data.name).toBe('Updated Name');
    });
  });

  describe('DELETE /api/restaurants/:id', () => {
    test('REQ-034: Restoranı başarıyla silme', async () => {
      const createResponse = await request(app)
        .post('/api/restaurants')
        .send({
          name: 'Delete Test',
          address: 'Delete Address'
        });

      const restaurantId = createResponse.body.data.id;

      const response = await request(app)
        .delete(`/api/restaurants/${restaurantId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });
});
