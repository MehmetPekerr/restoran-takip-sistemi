const db = require('../models/database');

class RestaurantService {
  async getAllRestaurants() {
    return await db.all('SELECT * FROM restaurants');
  }

  async getRestaurantById(id) {
    return await db.get('SELECT * FROM restaurants WHERE id = ?', [id]);
  }

  async createRestaurant(name, address, phone) {
    if (!name || !address) {
      throw new Error('Name ve address zorunludur');
    }
    await db.run(
      'INSERT INTO restaurants (name, address, phone) VALUES (?, ?, ?)',
      [name, address, phone]
    );
    const result = await db.get('SELECT * FROM restaurants ORDER BY id DESC LIMIT 1');
    return result;
  }

  async updateRestaurant(id, name, address, phone) {
    const existing = await this.getRestaurantById(id);
    if (!existing) {
      throw new Error('Restoran bulunamadı');
    }
    await db.run(
      'UPDATE restaurants SET name = ?, address = ?, phone = ? WHERE id = ?',
      [name || existing.name, address || existing.address, phone || existing.phone, id]
    );
    return await this.getRestaurantById(id);
  }

  async deleteRestaurant(id) {
    const existing = await this.getRestaurantById(id);
    if (!existing) {
      throw new Error('Restoran bulunamadı');
    }
    await db.run('DELETE FROM restaurants WHERE id = ?', [id]);
    return { success: true, id };
  }
}

module.exports = new RestaurantService();
