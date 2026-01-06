const pool = require('./index');

async function initDB() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS clientes (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        dni VARCHAR(20) UNIQUE NOT NULL,
        telefono VARCHAR(30),
        creado_en TIMESTAMP DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        contacto VARCHAR(50),
        pass VARCHAR(255) NOT NULL,
        rol VARCHAR(20) NOT NULL,
        creado_en TIMESTAMP DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS turnos (
        id SERIAL PRIMARY KEY,
        dia DATE NOT NULL,
        turno INTEGER NOT NULL,
        estado VARCHAR(20) NOT NULL,
        cliente_id INTEGER NOT NULL,
        creado_en TIMESTAMP DEFAULT NOW(),
        CONSTRAINT fk_cliente
          FOREIGN KEY(cliente_id)
          REFERENCES clientes(id)
          ON DELETE CASCADE
      );
    `);

    console.log('DB inicializada correctamente');
  } catch (err) {
    console.error('Error inicializando DB', err);
  }
}

module.exports = initDB;
   

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

module.exports = pool;
