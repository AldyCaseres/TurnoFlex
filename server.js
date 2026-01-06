const express = require('express');
const path = require('path');
const app = express();
const Seguridad = require('./seguridad.js');

// ================== CONFIGURACIÓN GLOBAL ==================
const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const TOKEN = process.env.APP_TOKEN || "dev-token";

// ================== MIDDLEWARE ==================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
 app.get('/health', (req, res) => {
  res.status(200).send('OK');
});
app.set('view engine', 'ejs');

// ================== LOGIN ==================
app.get('/', (req, res) => {
  res.render('login.ejs', { url: BASE_URL, token: TOKEN });
});

app.get('/login', (req, res) => {
  res.redirect('/');
});

// ================== VALIDAR LOGIN ==================
app.post('/menu', (req, res) => {
  const { usuario, contrasena, token } = req.body;

  if (usuario === "admin" && contrasena === "admin" && token === TOKEN) {
    res.render('menu.ejs', { url: BASE_URL, token: TOKEN });
  } else {
    res.send(`
      <h2>Usuario, contraseña o token incorrectos</h2>
      <a href="/">Volver al login</a>
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

app.post('/api/clientes', (req, res) => {
  let respuesta = Seguridad.nuevoCliente(req.body);
  if (respuesta.success) {
    res.render('menu.ejs', { url: BASE_URL, token: TOKEN });
  }
});

app.post('/dameClientes', (req, res) => {
  let resultado = Seguridad.dameClientes(req.body);
  if (resultado.success) {
    res.render('listadoclientes.ejs', {
      url: BASE_URL,
      token: TOKEN,
      clientes: resultado.clientes
    });
  }
});

app.post('/eliminarCliente', (req, res) => {
  let resultado = Seguridad.eliminarCliente(req.body);
  if (resultado.success) {
    res.render('menu.ejs', { url: BASE_URL, token: TOKEN });
  }
});

// ================== TURNOS ==================
app.post('/turnos', (req, res) => {
  let resultado = Seguridad.dameClientes(req.body);
  if (resultado.success) {
    res.render('index.ejs', {
      url: BASE_URL,
      token: TOKEN,
      clientes: resultado.clientes
    });
  }
});

app.post('/nuevoturno', (req, res) => {
  let respuesta = Seguridad.nuevoTurno(req.body);
  if (respuesta.success) {
    res.render('menu.ejs', { url: BASE_URL, token: TOKEN });
  }
});

app.post('/listarturnos', (req, res) => {
  let resultado = Seguridad.listarTurnos(req.body);
  if (resultado.success) {
    res.render('listadoturnos.ejs', {
      url: BASE_URL,
      token: TOKEN,
      turnos: resultado.turnos
    });
  }
});

app.post('/eliminarTurno', (req, res) => {
  let resultado = Seguridad.eliminarTurno(req.body);
  if (resultado.success) {
    res.render('menu.ejs', { url: BASE_URL, token: TOKEN });
  }
});

// ================== USUARIOS ==================
app.post('/usuario', (req, res) => {
  res.render('usuario.ejs', { url: BASE_URL, token: TOKEN });
});

app.post('/nuevousuario', (req, res) => {
  Seguridad.nuevoUsuario(req.body);
  res.render('menu.ejs', { url: BASE_URL, token: TOKEN });
});

app.post('/eliminarusuario', (req, res) => {
  Seguridad.eliminarUsuario(req.body);
  res.render('menu.ejs', { url: BASE_URL, token: TOKEN });
});

app.post('/usuarios', (req, res) => {
  let usuarios = Seguridad.dameUsuarios(req.body);
  res.render('usuarios.ejs', {
    url: BASE_URL,
    token: TOKEN,
    usuarios
  });
});

// ================== VOLVER ==================
app.post('/volver', (req, res) => {
  res.render('menu.ejs', { url: BASE_URL, token: TOKEN });
});

// ================== ESTILOS ==================
app.use('/public/style', express.static(path.join(__dirname, 'style')));

// ================== LOGOUT ==================
app.post('/logout', (req, res) => {
  res.redirect('/login');
});

// ================== SERVER ==================
const PORT = process.env.PORT;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`TurnoFlex escuchando en puerto ${PORT}`);
});



//=================db=======
const pool = require('./db');

app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM clientes');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error DB');
  }
});
