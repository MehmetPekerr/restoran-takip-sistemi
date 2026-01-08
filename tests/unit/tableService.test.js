const tableService = require('../../src/services/tableService');

jest.mock('../../src/models/database');
const db = require('../../src/models/database');

describe('TableService Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createTable', () => {
    test('REQ-011: Geçerli veriler ile masa oluşturma', async () => {
      const mockTable = { id: 1, restaurant_id: 1, table_number: 1, capacity: 4 };
      db.run.mockResolvedValue(true);
      db.get.mockResolvedValue(mockTable);

      const result = await tableService.createTable(1, 1, 4);

      expect(result).toBeDefined();
      expect(result.table_number).toBe(1);
    });

    test('REQ-012: Eksik restaurantId ile exception fırlatma', async () => {
      await expect(tableService.createTable(null, 1, 4)).rejects.toThrow();
    });
  });

  describe('updateTableStatus', () => {
    test('REQ-013: Geçerli duruma masa durumunu güncelleme', async () => {
      const mockTable = { id: 1, status: 'occupied' };
      db.run.mockResolvedValue(true);
      db.get.mockResolvedValue(mockTable);

      const result = await tableService.updateTableStatus(1, 'occupied');

      expect(result.status).toBe('occupied');
    });

    test('REQ-014: Geçersiz durumda exception fırlatma', async () => {
      await expect(tableService.updateTableStatus(1, 'invalid_status')).rejects.toThrow();
    });
  });

  describe('getAvailableTables', () => {
    test('REQ-015: Boş masaları listeleme', async () => {
      const mockTables = [
        { id: 1, status: 'available' },
        { id: 2, status: 'available' }
      ];
      db.all.mockResolvedValue(mockTables);

      const result = await tableService.getAvailableTables(1);

      expect(result).toHaveLength(2);
      expect(result.every(t => t.status === 'available')).toBe(true);
    });
  });
});
