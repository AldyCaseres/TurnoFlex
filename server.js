require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();

const Seguridad = require('./seguridad.js');
// Importamos initDB y pool directamente desde el archivo init.js
const { initDB, pool } = require('./db/init');



// ================== CONFIGURACIÓN GLOBAL ==================
const BASE_URL = process.env.BASE_URL || 'http://localhost:8080';
const TOKEN = process.env.APP_TOKEN || 'dev-token';

// ================== MIDDLEWARE ==================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// ================== HEALTHCHECK (Railway) ==================
app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.status(200).send('OK');
  } catch (err) {
    console.error('Health DB error:', err);
    res.status(500).send('DB ERROR');
  }
});

// HOME PUBLICA - SOLO LECTURA
app.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT dia, turno, estado
      FROM turnos
      ORDER BY dia, turno
    `);

    const turnosPorDia = {};

    result.rows.forEach(t => {
      const diaKey = t.dia.toISOString().split('T')[0];

      if (!turnosPorDia[diaKey]) {
        turnosPorDia[diaKey] = [];
      }

      turnosPorDia[diaKey].push(t);
    });

    res.render('home.ejs', { turnosPorDia });
  } catch (err) {
    console.error('HOME ERROR:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/crearHorario', (req, res) => {
  res.render('crearHorarios.ejs', {
    token: TOKEN
  });
});


app.post('/guardarHorario', async (req, res) => {
   console.log('BODY:', req.body);
  const r = await Seguridad.crearHorario(req.body);

  if (r.success) {
        res.render('menu.ejs', { url: BASE_URL, token: TOKEN });
  } else {
    res.send('Error al crear horario');
  }
});



// ================== LOGIN ==================
app.get('/login', (req, res) => {
  res.render('login.ejs', { url: BASE_URL, token: TOKEN });
});

app.post('/menu', (req, res) => {
  const { usuario, contrasena, token } = req.body;

  if (usuario === 'admin' && contrasena === 'admin' && token === TOKEN) {
    res.render('menu.ejs', { url: BASE_URL, token: TOKEN });
  } else {
    res.send(`
      <h2>Usuario, contraseña o token incorrectos</h2>
      <a href="/">Volver</a>
    `);
  }
});

app.post('/menuGeneral', (req, res) => {
  res.render('menu.ejs', { url: BASE_URL, token: TOKEN });
});

// ================== CLIENTES ==================
app.post('/clientes', (req, res) => {
  res.render('clientes.ejs', { url: BASE_URL, token: TOKEN });
});

app.post('/api/clientes', async (req, res) => {
  const respuesta = await Seguridad.nuevoCliente(req.body);

  if (respuesta.success) {
    res.render('menu.ejs', { url: BASE_URL, token: TOKEN });
  } else {
    console.error('ERROR NUEVO CLIENTE:', respuesta);
    res.status(500).json(respuesta);
  }
});


app.post('/dameClientes', async (req, res) => {
  const resultado = await Seguridad.dameClientes(req.body);

  if (resultado.success) {
    res.render('listadoclientes.ejs', {
      url: BASE_URL,
      token: TOKEN,
      clientes: resultado.clientes
    });
  } else {
    res.status(401).send('No autorizado');
  }
});

app.post('/eliminarCliente', async (req, res) => {
  const resultado = await Seguridad.eliminarCliente(req.body);

  if (resultado.success) {
    res.render('menu.ejs', { url: BASE_URL, token: TOKEN });
  } else {
    res.status(401).send('No autorizado');
  }
});

// ================== TURNOS ==================
app.post('/turnos', async (req, res) => {
  const resultado = await Seguridad.dameClientes(req.body);

  if (resultado.success) {
    res.render('index.ejs', {
      url: BASE_URL,
      token: TOKEN,
      clientes: resultado.clientes
    });
  } else {
    res.status(401).send('No autorizado');
  }
});

app.post('/nuevoturno', async (req, res) => {
  const respuesta = await Seguridad.nuevoTurno(req.body);

  if (respuesta.success) {
    res.render('menu.ejs', { url: BASE_URL, token: TOKEN });
  } else {
    res.status(401).send('Error al crear turno');
  }
});

app.post('/listarturnos', async (req, res) => {
  const resultado = await Seguridad.listarTurnos(req.body);

  if (resultado.success) {
    res.render('listadoturnos.ejs', {
      url: BASE_URL,
      token: TOKEN,
      turnos: resultado.turnos
    });
  } else {
    res.status(401).send('No autorizado');
  }
});

app.post('/eliminarTurno', async (req, res) => {
  const resultado = await Seguridad.eliminarTurno(req.body);

  if (resultado.success) {
    res.render('menu.ejs', { url: BASE_URL, token: TOKEN });
  } else {
    res.status(401).send('No autorizado');
  }
});

app.post('/ocuparTurno', async (req, res) => {
  const respuesta = await Seguridad.ocuparTurno(req.body);

  if (respuesta.success) {
    res.render('menu.ejs', { url: BASE_URL, token: TOKEN });
  } else {
    res.status(400).send(respuesta.message || 'No se pudo ocupar el turno');
  }
});

// ================== USUARIOS ==================
app.post('/usuario', (req, res) => {
  res.render('usuario.ejs', { url: BASE_URL, token: TOKEN });
});

app.post('/nuevousuario', async (req, res) => {
  const resultado = await Seguridad.nuevoUsuario(req.body);

  if (resultado.success) {
    res.render('menu.ejs', { url: BASE_URL, token: TOKEN });
  } else {
    res.status(401).send('Error al crear usuario');
  }
});

app.post('/eliminarusuario', async (req, res) => {
  const resultado = await Seguridad.eliminarUsuario(req.body);

  if (resultado.success) {
    res.render('menu.ejs', { url: BASE_URL, token: TOKEN });
  } else {
    res.status(401).send('No autorizado');
  }
});

app.post('/usuarios', async (req, res) => {
  const resultado = await Seguridad.dameUsuarios(req.body);

  if (resultado.success) {
    res.render('usuarios.ejs', {
      url: BASE_URL,
      token: TOKEN,
      usuarios: resultado.usuarios
    });
  } else {
    res.status(401).send('No autorizado');
  }
});

// ================== DEBUG / TEST DB ==================
app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM clientes');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('DB ERROR');
  }
});

// ================== LOGOUT ==================
app.post('/logout', (req, res) => {
  res.redirect('/login');
});

// ================== SERVER ==================
const PORT = process.env.PORT || 8080;

async function startServer() {
  try {
    await initDB();
    app.listen(PORT, '127.0.0.1', () => {
      console.log(`TurnoFlex escuchando en http://127.0.0.1:${PORT}`);
    });
  } catch (err) {
    console.error('❌ No se pudo iniciar el servidor:', err);
    process.exit(1);
  }
}

startServer();
