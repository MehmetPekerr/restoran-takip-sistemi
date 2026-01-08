const orderService = require('../../src/services/orderService');

jest.mock('../../src/models/database');
const db = require('../../src/models/database');

describe('OrderService Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllOrders', () => {
    test('REQ-020: Tüm siparişleri getirme', async () => {
      const mockOrders = [
        { id: 1, restaurant_id: 1, table_id: 1, menu_id: 1, quantity: 2 },
        { id: 2, restaurant_id: 1, table_id: 2, menu_id: 2, quantity: 1 }
      ];
      db.all.mockResolvedValue(mockOrders);

      const result = await orderService.getAllOrders();

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe(1);
      expect(result[1].id).toBe(2);
    });
  });

  describe('createOrder', () => {
    test('REQ-021: Geçerli veriler ile sipariş oluşturma', async () => {
      const mockOrder = { id: 1, restaurant_id: 1, table_id: 1, menu_id: 1, quantity: 2 };
      db.run.mockResolvedValue(true);
      db.get.mockResolvedValue(mockOrder);

      const result = await orderService.createOrder(1, 1, 1, 2);

      expect(result).toBeDefined();
      expect(result.quantity).toBe(2);
    });

    test('REQ-022: Negatif quantity ile exception fırlatma', async () => {
      await expect(orderService.createOrder(1, 1, 1, -1)).rejects.toThrow();
    });

    test('REQ-023: Eksik restaurantId ile exception fırlatma', async () => {
      await expect(orderService.createOrder(null, 1, 1, 1)).rejects.toThrow();
    });
  });

  describe('updateOrderStatus', () => {
    test('REQ-024: Geçerli duruma sipariş durumunu güncelleme', async () => {
      const mockOrder = { id: 1, status: 'preparing' };
      db.run.mockResolvedValue(true);
      db.get.mockResolvedValue(mockOrder);

      const result = await orderService.updateOrderStatus(1, 'preparing');

      expect(result.status).toBe('preparing');
    });

    test('REQ-025: Geçersiz durumda exception fırlatma', async () => {
      await expect(orderService.updateOrderStatus(1, 'invalid_status')).rejects.toThrow();
    });
  });

  describe('completeOrder', () => {
    test('REQ-026: Siparişi tamamlama', async () => {
      const mockOrder = { id: 1, status: 'completed' };
      db.run.mockResolvedValue(true);
      db.get.mockResolvedValue(mockOrder);

      const result = await orderService.completeOrder(1);

      expect(result.status).toBe('completed');
    });
  });

  describe('getPendingOrders', () => {
    test('REQ-027: Beklemede olan siparişleri listeleme', async () => {
      const mockOrders = [
        { id: 1, status: 'pending' },
        { id: 2, status: 'preparing' }
      ];
      db.all.mockResolvedValue(mockOrders);

      const result = await orderService.getPendingOrders(1);

      expect(result).toHaveLength(2);
      expect(result.every(o => o.status !== 'completed')).toBe(true);
    });
  });
});
