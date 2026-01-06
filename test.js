const { Turno } = require('./clases.js')
    const Modelo = require('./modelo.js')
    const Controlador = require('./controlador.js')
    const Seguridad = require('./seguridad.js')

function testTurno(){
    const miTurno = new Turno("lunes",2,true)
    console.log(miTurno.dia == 'lunes')
    console.log(miTurno.hora == 2)
    console.log(miTurno.libre == true)
}
function testCliente() {
    const miTurno = new Turno("lunes", 2, true);
    console.log(miTurno.dia === 'lunes');
    console.log(miTurno.hora === 2);
    console.log(miTurno.libre === true);
}
function tesGetClientes() {

    
    const clientes = Modelo.getClientes()
    console.log("Clientes:")
    console.log(clientes)
}
function testGetUsuarios(){
    //const usuarios = Modelo.getUsuarios()
    //const usuarios = Controlador.dameUsuarios()
    let data = {}
    data.token = 'lkjrt4v3wmtiqoprmmor98'
    const usuarios = Seguridad.dameUsuarios(data)
    console.log(usuarios)
}

//testCliente();
//testTurno();
//tesGetClientes();
testGetUsuarios()


