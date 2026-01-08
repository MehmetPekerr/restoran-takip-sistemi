const db = require('../../src/models/database');

describe('Database Wrapper Basic Tests', () => {
  test('REQ-DB-001: run() ile tablo oluşturma', async () => {
    await db.run('CREATE TABLE IF NOT EXISTS tmp_test (id INTEGER PRIMARY KEY, val TEXT)');
    const row = await db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='tmp_test'");
    expect(row).toBeDefined();
  });

  test('REQ-DB-002: run() + get() + all() temel CRUD', async () => {
    await db.run('INSERT INTO tmp_test (val) VALUES (?)', ['hello']);
    const one = await db.get('SELECT * FROM tmp_test WHERE val = ?', ['hello']);
    expect(one.val).toBe('hello');
    const rows = await db.all('SELECT * FROM tmp_test');
    expect(rows.length).toBeGreaterThan(0);
  });

  afterAll(async () => {
    await db.close();
  });
});
