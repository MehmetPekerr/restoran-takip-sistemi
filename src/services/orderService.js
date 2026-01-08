const db = require('../models/database');

class OrderService {
  async getAllOrders() {
    return await db.all('SELECT * FROM orders ORDER BY id DESC');
  }

  async getOrderById(id) {
    return await db.get('SELECT * FROM orders WHERE id = ?', [id]);
  }

  async getOrdersByRestaurantId(restaurantId) {
    return await db.all('SELECT * FROM orders WHERE restaurant_id = ?', [restaurantId]);
  }

  async getOrdersByTableId(tableId) {
    return await db.all('SELECT * FROM orders WHERE table_id = ?', [tableId]);
  }

  async createOrder(restaurantId, tableId, menuId, quantity) {
    if (!restaurantId || !tableId || !menuId) {
      throw new Error('Restaurant ID, table ID ve menu ID zorunludur');
    }
    if (quantity <= 0) {
      throw new Error('Quantity pozitif bir sayı olmalı');
    }
    await db.run(
      'INSERT INTO orders (restaurant_id, table_id, menu_id, quantity) VALUES (?, ?, ?, ?)',
      [restaurantId, tableId, menuId, quantity || 1]
    );
    return await db.get('SELECT * FROM orders ORDER BY id DESC LIMIT 1');
  }

  async updateOrderStatus(id, status) {
    const validStatuses = ['pending', 'preparing', 'ready', 'served', 'completed'];
    if (!validStatuses.includes(status)) {
      throw new Error('Geçersiz sipariş durumu');
    }
    await db.run('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
    return await this.getOrderById(id);
  }

  async completeOrder(id) {
    return await this.updateOrderStatus(id, 'completed');
  }

  async getPendingOrders(restaurantId) {
    return await db.all(
      'SELECT * FROM orders WHERE restaurant_id = ? AND status != "completed"',
      [restaurantId]
    );
  }
}

module.exports = new OrderService();
