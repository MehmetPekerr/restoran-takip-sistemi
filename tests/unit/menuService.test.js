const menuService = require('../../src/services/menuService');

jest.mock('../../src/models/database');
const db = require('../../src/models/database');

describe('MenuService Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createMenuItem', () => {
    test('REQ-016: Geçerli veriler ile menü öğesi oluşturma', async () => {
      const mockMenu = { id: 1, restaurant_id: 1, item_name: 'Pizza', price: 25.00 };
      db.run.mockResolvedValue(true);
      db.get.mockResolvedValue(mockMenu);

      const result = await menuService.createMenuItem(1, 'Pizza', 'Leziz Pizza', 25.00);

      expect(result).toBeDefined();
      expect(result.item_name).toBe('Pizza');
      expect(result.price).toBe(25.00);
    });

    test('REQ-017: Negatif price ile exception fırlatma', async () => {
      await expect(menuService.createMenuItem(1, 'Pizza', 'Description', -10)).rejects.toThrow();
    });

    test('REQ-018: Eksik item_name ile exception fırlatma', async () => {
      await expect(menuService.createMenuItem(1, '', 'Description', 25)).rejects.toThrow();
    });
  });

  describe('deleteMenuItem', () => {
    test('REQ-019: Menü öğesini silme', async () => {
      const mockMenu = { id: 1, item_name: 'Pizza' };
      db.get.mockResolvedValue(mockMenu);
      db.run.mockResolvedValue(true);

      const result = await menuService.deleteMenuItem(1);

      expect(result.success).toBe(true);
    });

    test('REQ-020: Olmayan menü öğesini silmede exception', async () => {
      db.get.mockResolvedValue(null);

      await expect(menuService.deleteMenuItem(999)).rejects.toThrow();
    });
  });
});
