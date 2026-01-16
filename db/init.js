const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production'
    ? { rejectUnauthorized: false }
    : false
});

async function initDB() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS clientes (
        id SERIAL PRIMARY KEY,
        nombre TEXT NOT NULL,
        dni TEXT UNIQUE NOT NULL,
        telefono TEXT NOT NULL
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        nombre TEXT NOT NULL,
        contacto TEXT UNIQUE NOT NULL,
        pass TEXT NOT NULL,
        rol TEXT NOT NULL
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS turnos (
        id SERIAL PRIMARY KEY,
        dia DATE NOT NULL,
        turno INT NOT NULL,
        estado TEXT NOT NULL,
        cliente_id INT REFERENCES clientes(id)
      );
    `);

    console.log('✅ DB inicializada correctamente');
  } catch (err) {
    console.error('❌ Error inicializando DB:', err);
  }
}

module.exports = { initDB, pool };
