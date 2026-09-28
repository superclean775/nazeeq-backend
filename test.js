const { Pool } = require('pg');

const pool = new Pool({
  host: '127.0.0.1',
  user: process.env.USER,
  database: 'nazeef_db',
  port: 5432,
});

async function testDB() {
  try {
    const res = await pool.query('SELECT * FROM stores;');
    console.log('--- عدد المتاجر الموجودة ---');
    console.log(res.rows);
  } catch (err) {
    console.error('--- خطأ الاتصال ---');
    console.error(err.message);
  } finally {
    await pool.end();
  }
}

testDB();
