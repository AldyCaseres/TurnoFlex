const Controlador = require('./controlador.js');

const TOKEN = 'lkjrt4v3wmtiqoprmmor98';

// ================== TURNOS ==================

async function nuevoTurno(data) {
  if (data.token !== TOKEN) return { success: false };

  data.estado = 'ocupado';

  await Controlador.nuevoTurno(data);
  return { success: true };
}

async function listarTurnos(data) {
  if (data.token !== TOKEN) return { success: false };

  const turnos = await Controlador.listarTurnos();
  return { success: true, turnos };
}

async function eliminarTurno(data) {
  if (data.token !== TOKEN) return { success: false };

  await Controlador.eliminarTurno(data.id);
  return { success: true };
}

// ================== CLIENTES ==================

async function nuevoCliente(data) {
  if (data.token !== TOKEN) return { success: false };

  await Controlador.nuevoCliente(data);
  return { success: true };
}

async function dameClientes(data) {
  if (data.token !== TOKEN) return { success: false };

  const clientes = await Controlador.dameClientes();
  return { success: true, clientes };
}

async function eliminarCliente(data) {
  if (data.token !== TOKEN) return { success: false };

  await Controlador.eliminarCliente(data.id);
  return { success: true };
}

// ================== USUARIOS ==================

async function nuevoUsuario(data) {
  if (data.token !== TOKEN) return { success: false };

  await Controlador.nuevoUsuario(data);
  return { success: true };
}

async function eliminarUsuario(data) {
  if (data.token !== TOKEN) return { success: false };

  await Controlador.eliminarUsuario(data.id);
  return { success: true };
}

async function dameUsuarios(data) {
  if (data.token !== TOKEN) return { success: false };

  const usuarios = await Controlador.dameUsuarios();
  return { success: true, usuarios };
}
async function crearTurnoLibre(data) {
  if (data.token !== TOKEN) return { success: false };

  return Controlador.crearTurnoLibre(data);
}

async function ocuparTurno(data) {
  if (data.token !== TOKEN) return { success: false };

  return Controlador.ocuparTurno(data);
}

async function crearHorario(data) {
  if (data.token !== TOKEN) return { success: false };

  return await Controlador.crearHorario(data);
}


module.exports = {
  nuevoTurno,
  listarTurnos,
  eliminarTurno,
  nuevoCliente,
  dameClientes,
  eliminarCliente,
  nuevoUsuario,
  eliminarUsuario,
  dameUsuarios, 
  crearTurnoLibre,
  crearHorario,
  ocuparTurno
};
