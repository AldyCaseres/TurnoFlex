const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production'
    ? { rejectUnauthorized: false }
    : false
});

async function initDB() {
  try {
    await pool.query('SELECT 1');
    console.log('✅ DB inicializada correctamente');
  } catch (err) {
    console.error('❌ Error inicializando DB:', err);
    throw err; // ← NUNCA process.exit acá
  }
}


module.exports = {
  pool,
  initDB
};
