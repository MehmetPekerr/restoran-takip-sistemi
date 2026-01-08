const request = require('supertest');
const { app } = require('../../src/app');

describe('API Integration Tests - Menus', () => {
  let restaurantId;

  beforeAll(async () => {
    const response = await request(app)
      .post('/api/restaurants')
      .send({
        name: 'Test Restaurant for Menus',
        address: 'Test Address'
      });
    restaurantId = response.body.data.id;
  });

  describe('POST /api/restaurants/:id/menus', () => {
    test('REQ-039: Menüye yeni öğe ekleme', async () => {
      const response = await request(app)
        .post(`/api/restaurants/${restaurantId}/menus`)
        .send({
          itemName: 'Pizza Margarita',
          description: 'Ev yapımı leziz pizza',
          price: 25.50
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.item_name).toBe('Pizza Margarita');
      expect(response.body.data.price).toBe(25.50);
    });

    test('REQ-040: Negatif fiyatla menü öğesi ekleme başarısız', async () => {
      const response = await request(app)
        .post(`/api/restaurants/${restaurantId}/menus`)
        .send({
          itemName: 'Pasta',
          price: -10
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/restaurants/:id/menus', () => {
    test('REQ-041: Restoran menüsünü getirme', async () => {
      const response = await request(app)
        .get(`/api/restaurants/${restaurantId}/menus`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('DELETE /api/menus/:id', () => {
    test('REQ-042: Menü öğesini silme', async () => {
      const createResponse = await request(app)
        .post(`/api/restaurants/${restaurantId}/menus`)
        .send({
          itemName: 'Burger',
          price: 15.00
        });

      const menuId = createResponse.body.data.id;

      const response = await request(app)
        .delete(`/api/menus/${menuId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });
});
