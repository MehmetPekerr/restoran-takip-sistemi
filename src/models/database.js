const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', 'restoran.db');

class Database {
  constructor() {
    this.db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        if (process.env.NODE_ENV !== 'test') {
          console.error('Veritabanı bağlantı hatası:', err);
        }
      } else {
        if (process.env.NODE_ENV !== 'test') {
          console.log('Veritabanı bağlantısı başarılı');
        }
        this.initialize();
      }
    });
  }

  initialize() {
    this.db.serialize(() => {
      // Restoranlar tablosu
      this.db.run(`
        CREATE TABLE IF NOT EXISTS restaurants (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          address TEXT NOT NULL,
          phone TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Masalar tablosu
      this.db.run(`
        CREATE TABLE IF NOT EXISTS tables (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          restaurant_id INTEGER NOT NULL,
          table_number INTEGER NOT NULL,
          capacity INTEGER DEFAULT 4,
          status TEXT DEFAULT 'available',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY(restaurant_id) REFERENCES restaurants(id)
        )
      `);

      // Menü tablosu
      this.db.run(`
        CREATE TABLE IF NOT EXISTS menus (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          restaurant_id INTEGER NOT NULL,
          item_name TEXT NOT NULL,
          description TEXT,
          price REAL NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY(restaurant_id) REFERENCES restaurants(id)
        )
      `);

      // Siparişler tablosu
      this.db.run(`
        CREATE TABLE IF NOT EXISTS orders (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          restaurant_id INTEGER NOT NULL,
          table_id INTEGER NOT NULL,
          menu_id INTEGER NOT NULL,
          quantity INTEGER DEFAULT 1,
          status TEXT DEFAULT 'pending',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY(restaurant_id) REFERENCES restaurants(id),
          FOREIGN KEY(table_id) REFERENCES tables(id),
          FOREIGN KEY(menu_id) REFERENCES menus(id)
        )
      `);
    });
  }

  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, (err) => {
        if (err) reject(err);
        else resolve(this);
      });
    });
  }

  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  all(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  close() {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
}

module.exports = new Database();
