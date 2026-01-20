const { pool } = require('./db/init');

// ================== CLIENTES ==================

async function nuevoCliente(data) {
    console.log('DATA CLIENTE:', data);
  const { nombre, dni, telefono } = data;
  
  if (!nombre || !dni || !telefono) {
    return { success: false, message: 'Datos incompletos' };
  }
  console.log('DATA CLIENTE:', data);

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
    'DELETE FROM turnos WHERE dia = $1 AND turno = $2',
    [dni]
  );

  await pool.query(
    'DELETE FROM clientes WHERE dni = $1',
    [dni]
  );

  return { success: true };
}

// ================== TURNOS ==================

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


async function crearHorario(data) {
  try {
    const { dia, turno } = data;

    if (!dia || !turno) {
      return { success: false, message: 'Datos incompletos' };
    }

    const existe = await pool.query(
      'SELECT 1 FROM turnos WHERE dia = $1 AND turno = $2',
      [dia, turno]
    );

    if (existe.rowCount > 0) {
      return { success: false, message: 'Horario ya existe' };
    }

    await pool.query(
      `INSERT INTO turnos (dia, turno, estado)
       VALUES ($1, $2, 'libre')`,
      [dia, turno]
    );

    return { success: true };
  } catch (err) {
    console.error('ERROR crearHorario:', err);
    return { success: false, message: 'DB error' };
  }
}

async function ocuparTurno(data) {
  const { dia, turno, cliente } = data;

  if (!dia || !turno || !cliente) {
    return { success: false, message: 'Datos incompletos' };
  }

  // Extraer DNI del string del datalist
  const regex = /^(.+?) - DNI: (\d+) - Tel: (\d+)$/;
  const match = cliente.match(regex);

  if (!match) {
    return { success: false, message: 'Cliente inválido' };
  }

  const dni = match[2];

  // Buscar cliente_id
  const clienteDB = await pool.query(
    'SELECT id FROM clientes WHERE dni = $1',
    [dni]
  );

  if (clienteDB.rowCount === 0) {
    return { success: false, message: 'Cliente no existe' };
  }

  const cliente_id = clienteDB.rows[0].id;

  // Verificar que el turno esté libre
  const libre = await pool.query(
    `SELECT 1 FROM turnos
     WHERE dia = $1 AND turno = $2 AND estado = 'libre'`,
    [dia, turno]
  );

  if (libre.rowCount === 0) {
    return { success: false, message: 'Turno no disponible' };
  }

  // OCUPAR TURNO (NO INSERT)
  await pool.query(
    `UPDATE turnos
     SET estado = 'ocupado', cliente_id = $3
     WHERE dia = $1 AND turno = $2`,
    [dia, turno, cliente_id]
  );

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
  listarTurnos,
  eliminarTurno,
  crearHorario,
  nuevoUsuario,
  eliminarUsuario,
  dameUsuarios,
  ocuparTurno
};
