require('dotenv').config();
const Controlador = require('./controlador.js');

const TOKEN = process.env.APP_TOKEN;

function validarToken(data) {
  if (!data || data.token !== TOKEN) {
    console.error('❌ TOKEN INVALIDO:', data?.token);
    return false;
  }
  return true;
}

// ================== TURNOS ==================


async function listarTurnos(data) {
  if (!validarToken(data)) return { success: false };

  try {
    const turnos = await Controlador.listarTurnos();
    return { success: true, turnos };
  } catch (err) {
    console.error('ERROR listarTurnos:', err);
    return { success: false };
  }
}

async function eliminarTurno(data) {
  if (!validarToken(data)) return { success: false };

  try {
    return await Controlador.eliminarTurno(data);
  } catch (err) {
    console.error('ERROR eliminarTurno:', err);
    return { success: false };
  }
}

// ================== CLIENTES ==================

async function nuevoCliente(data) {
  if (!validarToken(data)) return { success: false };

  try {
    console.log('DATA CLIENTE:', data);
    return await Controlador.nuevoCliente(data);
  } catch (err) {
    console.error('ERROR nuevoCliente:', err);
    return { success: false };
  }
}

async function dameClientes(data) {
  if (!validarToken(data)) return { success: false };

  try {
    const clientes = await Controlador.dameClientes();
    return { success: true, clientes };
  } catch (err) {
    console.error('ERROR dameClientes:', err);
    return { success: false };
  }
}

async function eliminarCliente(data) {
  if (!validarToken(data)) return { success: false };

  try {
    return await Controlador.eliminarCliente(data);
  } catch (err) {
    console.error('ERROR eliminarCliente:', err);
    return { success: false };
  }
}

// ================== USUARIOS ==================

async function nuevoUsuario(data) {
  if (!validarToken(data)) return { success: false };

  try {
    return await Controlador.nuevoUsuario(data);
  } catch (err) {
    console.error('ERROR nuevoUsuario:', err);
    return { success: false };
  }
}

async function eliminarUsuario(data) {
  if (!validarToken(data)) return { success: false };

  try {
    return await Controlador.eliminarUsuario(data);
  } catch (err) {
    console.error('ERROR eliminarUsuario:', err);
    return { success: false };
  }
}

async function dameUsuarios(data) {
  if (!validarToken(data)) return { success: false };

  try {
    const usuarios = await Controlador.dameUsuarios();
    return { success: true, usuarios };
  } catch (err) {
    console.error('ERROR dameUsuarios:', err);
    return { success: false };
  }
}

// ================== HORARIOS ==================

async function crearHorario(data) {
  if (!validarToken(data)) return { success: false };

  try {
    return await Controlador.crearHorario(data);
  } catch (err) {
    console.error('ERROR crearHorario:', err);
    return { success: false };
  }
}
async function ocuparTurno(data) {
  if (data.token !== TOKEN) return { success: false };

  return await Controlador.ocuparTurno(data);
}


// ================== EXPORTS ==================

module.exports = {
  
  listarTurnos,
  eliminarTurno,
  nuevoCliente,
  dameClientes,
  eliminarCliente,
  nuevoUsuario,
  eliminarUsuario,
  dameUsuarios,
  crearHorario,
  ocuparTurno
};
