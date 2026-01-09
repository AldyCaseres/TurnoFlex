const pool = require('./db');

// ================== CLIENTES ==================

async function nuevoCliente(data) {
  const { nombre, dni, telefono } = data;

  if (!nombre || !dni || !telefono) {
    return { success: false, message: 'Datos incompletos' };
  }

  // verificar duplicado
  const existe = await pool.query(
    'SELECT 1 FROM clientes WHERE dni = $1',
    [dni]
  );

  if (existe.rowCount > 0) {
    return { success: false, message: 'Cliente ya existe' };
  }

  await pool.query(
    'INSERT INTO clientes (nombre, dni, telefono) VALUES ($1, $2, $3)',
    [nombre, dni, telefono]
  );

  return { success: true };
}

async function dameClientes() {
  const result = await pool.query(
    'SELECT id, nombre, dni, telefono FROM clientes ORDER BY nombre'
  );
  return result.rows;
}

async function eliminarCliente(data) {
  const { dni } = data;

  if (!dni) {
    return { success: false, message: 'DNI requerido' };
  }

  // borrar turnos primero (FK)
  await pool.query(
    `DELETE FROM turnos 
     WHERE cliente_id = (SELECT id FROM clientes WHERE dni = $1)`,
    [dni]
  );

  await pool.query(
    'DELETE FROM clientes WHERE dni = $1',
    [dni]
  );

  return { success: true };
}

// ================== TURNOS ==================
async function nuevoTurno(data) {
  const { dia, turno, cliente } = data;

  if (!dia || !turno || !cliente) {
    return { success: false, message: 'Datos incompletos' };
  }

  // 1. Verificar turno duplicado - CAMBIADO 'hora' por 'turno'
  const existe = await pool.query(
    'SELECT 1 FROM turnos WHERE dia = $1 AND turno = $2',
    [dia, turno]
  );

  if (existe.rowCount > 0) {
    return { success: false, message: 'Turno ocupado' };
  }

  // extraer DNI del string
  const regex = /^(.+?) - DNI: (\d+) - Tel: (\d+)$/;
  const match = cliente.match(regex);

  if (!match) {
    return { success: false, message: 'Cliente inválido' };
  }

  const dni = match[2];

  const clienteDB = await pool.query(
    'SELECT id FROM clientes WHERE dni = $1',
    [dni]
  );

  if (clienteDB.rowCount === 0) {
    return { success: false, message: 'Cliente no existe' };
  }

  // 2. Insertar - CAMBIADO 'hora' por 'turno'
  await pool.query(
    `INSERT INTO turnos (dia, turno, estado, cliente_id)
     VALUES ($1, $2, 'ocupado', $3)`,
    [dia, turno, clienteDB.rows[0].id]
  );

  return { success: true };
}

async function listarTurnos() {
  const result = await pool.query(`
    SELECT 
      t.id,
      t.dia,
      t.turno,
      t.estado,
      c.nombre,
      c.dni,
      c.telefono
    FROM turnos t
    JOIN clientes c ON c.id = t.cliente_id
    ORDER BY t.dia, t.turno
  `);

  return result.rows;
}

async function eliminarTurno(data) {
  const { dia, turno } = data;

  if (!dia || !turno) {
    return { success: false };
  }

  await pool.query(
    'DELETE FROM turnos WHERE dia = $1 AND hora = $2',
    [dia, turno]
  );

  return { success: true };
}

async function crearTurnoLibre(data) {
  const { dia, turno } = data;

  await pool.query(`
    INSERT INTO turnos (dia, turno, estado)
    VALUES ($1, $2, 'libre')
  `, [dia, turno]);

  return { success: true };
}
async function ocuparTurno(data) {
  const { turno_id, cliente_id } = data;

  await pool.query(`
    UPDATE turnos
    SET estado = 'ocupado',
        cliente_id = $1
    WHERE id = $2
      AND estado = 'libre'
  `, [cliente_id, turno_id]);

  return { success: true };
}


// ================== USUARIOS ==================

async function nuevoUsuario(data) {
  const { nombre, contacto, pass, rol } = data;

  if (!nombre || !contacto || !pass || !rol) {
    return { success: false };
  }

  const existe = await pool.query(
    'SELECT 1 FROM usuarios WHERE contacto = $1',
    [contacto]
  );

  if (existe.rowCount > 0) {
    return { success: false, message: 'Usuario existente' };
  }

  await pool.query(
    `INSERT INTO usuarios (nombre, contacto, pass, rol)
     VALUES ($1, $2, $3, $4)`,
    [nombre, contacto, pass, rol]
  );

  return { success: true };
}

async function eliminarUsuario(data) {
  await pool.query(
    'DELETE FROM usuarios WHERE contacto = $1',
    [data.contacto]
  );
  return { success: true };
}

async function dameUsuarios() {
  const result = await pool.query(
    'SELECT id, nombre, contacto, rol FROM usuarios ORDER BY nombre'
  );
  return result.rows;
}

// ================== EXPORTS ==================

module.exports = {
  nuevoCliente,
  dameClientes,
  eliminarCliente,
  nuevoTurno,
  listarTurnos,
  eliminarTurno,
  nuevoUsuario,
  eliminarUsuario,
  dameUsuarios
};
