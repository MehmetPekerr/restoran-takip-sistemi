const db = require('../models/database');

class MenuService {
  async getMenusByRestaurantId(restaurantId) {
    return await db.all('SELECT * FROM menus WHERE restaurant_id = ?', [restaurantId]);
  }

  async getMenuItemById(id) {
    return await db.get('SELECT * FROM menus WHERE id = ?', [id]);
  }

  async createMenuItem(restaurantId, itemName, description, price) {
    if (!restaurantId || !itemName || !price) {
      throw new Error('Restaurant ID, item name ve price zorunludur');
    }
    if (isNaN(price) || price <= 0) {
      throw new Error('Price geçerli bir sayı olmalı ve pozitif olmalı');
    }
    await db.run(
      'INSERT INTO menus (restaurant_id, item_name, description, price) VALUES (?, ?, ?, ?)',
      [restaurantId, itemName, description || '', price]
    );
    return await db.get('SELECT * FROM menus ORDER BY id DESC LIMIT 1');
  }

  async updateMenuItem(id, itemName, description, price) {
    const existing = await this.getMenuItemById(id);
    if (!existing) {
      throw new Error('Menü öğesi bulunamadı');
    }
    await db.run(
      'UPDATE menus SET item_name = ?, description = ?, price = ? WHERE id = ?',
      [itemName || existing.item_name, description || existing.description, price || existing.price, id]
    );
    return await this.getMenuItemById(id);
  }

  async deleteMenuItem(id) {
    const existing = await this.getMenuItemById(id);
    if (!existing) {
      throw new Error('Menü öğesi bulunamadı');
    }
    await db.run('DELETE FROM menus WHERE id = ?', [id]);
    return { success: true, id };
  }
}

module.exports = new MenuService();
