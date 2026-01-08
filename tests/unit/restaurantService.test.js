const restaurantService = require('../../src/services/restaurantService');

// Mock database
jest.mock('../../src/models/database');
const db = require('../../src/models/database');

describe('RestaurantService Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createRestaurant', () => {
    test('REQ-001: Geçerli veriler ile restoran oluşturma', async () => {
      const mockRestaurant = { id: 1, name: 'Test Restoran', address: 'Test Sokak', phone: '5551234567' };
      db.run.mockResolvedValue(true);
      db.get.mockResolvedValue(mockRestaurant);

      const result = await restaurantService.createRestaurant('Test Restoran', 'Test Sokak', '5551234567');
      
      expect(result).toBeDefined();
      expect(result.name).toBe('Test Restoran');
      expect(result.address).toBe('Test Sokak');
    });

    test('REQ-002: Eksik name ile exception fırlatma', async () => {
      await expect(restaurantService.createRestaurant('', 'Test Sokak')).rejects.toThrow();
    });

    test('REQ-003: Eksik address ile exception fırlatma', async () => {
      await expect(restaurantService.createRestaurant('Test Restoran', '')).rejects.toThrow();
    });
  });

  describe('getRestaurantById', () => {
    test('REQ-004: Mevcut restoran ID\'si ile restoran getirme', async () => {
      const mockRestaurant = { id: 1, name: 'Test Restoran', address: 'Test Sokak' };
      db.get.mockResolvedValue(mockRestaurant);

      const result = await restaurantService.getRestaurantById(1);

      expect(result).toBeDefined();
      expect(result.id).toBe(1);
    });

    test('REQ-005: Olmayan restoran ID\'si ile null dönme', async () => {
      db.get.mockResolvedValue(null);

      const result = await restaurantService.getRestaurantById(999);

      expect(result).toBeNull();
    });
  });

  describe('updateRestaurant', () => {
    test('REQ-006: Restoranı güncelleme', async () => {
      const existingRestaurant = { id: 1, name: 'Old Name', address: 'Old Address' };
      const updatedRestaurant = { id: 1, name: 'New Name', address: 'Old Address' };
      
      db.get.mockResolvedValueOnce(existingRestaurant);
      db.run.mockResolvedValue(true);
      db.get.mockResolvedValueOnce(updatedRestaurant);

      const result = await restaurantService.updateRestaurant(1, 'New Name', null, null);

      expect(result.name).toBe('New Name');
    });

    test('REQ-007: Olmayan restoran güncellemede exception', async () => {
      db.get.mockResolvedValue(null);

      await expect(restaurantService.updateRestaurant(999, 'New Name', null, null)).rejects.toThrow();
    });
  });

  describe('deleteRestaurant', () => {
    test('REQ-008: Restoranı silme', async () => {
      const mockRestaurant = { id: 1, name: 'Test Restoran' };
      db.get.mockResolvedValue(mockRestaurant);
      db.run.mockResolvedValue(true);

      const result = await restaurantService.deleteRestaurant(1);

      expect(result.success).toBe(true);
      expect(result.id).toBe(1);
    });

    test('REQ-009: Olmayan restoranı silmede exception', async () => {
      db.get.mockResolvedValue(null);

      await expect(restaurantService.deleteRestaurant(999)).rejects.toThrow();
    });
  });

  describe('getAllRestaurants', () => {
    test('REQ-010: Tüm restoranları listeleme', async () => {
      const mockRestaurants = [
        { id: 1, name: 'Restoran 1' },
        { id: 2, name: 'Restoran 2' }
      ];
      db.all.mockResolvedValue(mockRestaurants);

      const result = await restaurantService.getAllRestaurants();

      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('Restoran 1');
    });
  });
});
