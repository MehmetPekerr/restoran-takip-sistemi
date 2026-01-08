const db = require('../models/database');

class TableService {
  async getTablesByRestaurantId(restaurantId) {
    return await db.all('SELECT * FROM tables WHERE restaurant_id = ?', [restaurantId]);
  }

  async getTableById(id) {
    return await db.get('SELECT * FROM tables WHERE id = ?', [id]);
  }

  async createTable(restaurantId, tableNumber, capacity) {
    if (!restaurantId || !tableNumber) {
      throw new Error('Restaurant ID ve table number zorunludur');
    }
    await db.run(
      'INSERT INTO tables (restaurant_id, table_number, capacity) VALUES (?, ?, ?)',
      [restaurantId, tableNumber, capacity || 4]
    );
    return await db.get('SELECT * FROM tables ORDER BY id DESC LIMIT 1');
  }

  async updateTableStatus(id, status) {
    const validStatuses = ['available', 'occupied', 'reserved'];
    if (!validStatuses.includes(status)) {
      throw new Error('Geçersiz masa durumu');
    }
    await db.run('UPDATE tables SET status = ? WHERE id = ?', [status, id]);
    return await this.getTableById(id);
  }

  async getAvailableTables(restaurantId) {
    return await db.all(
      'SELECT * FROM tables WHERE restaurant_id = ? AND status = "available"',
      [restaurantId]
    );
  }
}

module.exports = new TableService();
