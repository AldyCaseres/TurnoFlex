const express = require('express')
const path = require('path')
const app = express()
const Seguridad = require('./seguridad.js')

app.use(express.json());
app.use(express.urlencoded({extended : false}))

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// --- Menú login y menú --------------------------------

app.get ('/',(req, res)=>{
    res.render('login.ejs',{url : "http://localhost:3000", token:"lkjrt4v3wmtiqoprmmor98"})
})
//--- App.get para cerrar sesion y redirigir a login ----
app.get('/login', (req, res) => {
  res.redirect('/'); // O render directo si preferís
});

// Ruta que recibe los datos del formulario de login
app.post('/menu', (req, res) => {
    // Extraemos los datos enviados desde el formulario (login.ejs)
    const { usuario, contrasena, token } = req.body;
    // Definimos el valor correcto del token que se debe verificar
    const tokenCorrecto = "lkjrt4v3wmtiqoprmmor98";

    // Validación de usuario, contraseña y token
    /**
     * Validación:
     * - El usuario debe ser "admin"
     * - La contraseña debe ser "admin"
     * - El token debe coincidir con el valor definido
     */
    if (usuario === "admin" && contrasena === "admin" && token === tokenCorrecto) {
        // Si todo es correcto, mostramos la vista 'menu.ejs' y pasamos el token y la url
        res.render('menu.ejs', {
            url: "http://localhost:3000",
            token: tokenCorrecto
        });
    } else {
        // Si los datos no son válidos, se muestra un mensaje de error directamente
        res.send(`
            <h2>Usuario, contraseña o token incorrectos</h2>
            <a href="/">Volver al login</a>
        `);
    }
});

app.post ('/menuGeneral', (req, res)=>{
    res.render('menu.ejs',{url : "http://localhost:3000", token:"lkjrt4v3wmtiqoprmmor98"})
})
// --- Listar Clientes ---------------------------------
app.post('/dameClientes', (req, res)=>{
    let resultado = Seguridad.dameClientes(req.body)
   if(resultado.success){
    res.render('listadoclientes.ejs',{url : "http://localhost:3000", token:"lkjrt4v3wmtiqoprmmor98",clientes: resultado.clientes})
}})
// ruta post para eliminar cliente
app.post('/eliminarCliente', (req, res)=>{
    console.log(req.body)
    // llama a seguridad para eliminar cliente
        //pasa los datos por req.body
    let resultado = Seguridad.eliminarCliente(req.body)
    if(resultado.success){ //si todo ok vuelve al menú
        res.render('menu.ejs',{url : "http://localhost:3000", token:"lkjrt4v3wmtiqoprmmor98"})
    }
})
// --- Usuarios ---------------------------------------

app.get('/usuarios', (req, res)=>{
    console.log(req.headers.token)
    console.log(req.body)
    res.send('http://localhost:3000')
})


// --- Clientes ---------------------------------------

app.post('/clientes', (req,res)=>{ // muestra el formulario de nuevo cliente
    console.log(req.body)
    res.render('clientes.ejs',{url: "http://localhost:3000", token:"lkjrt4v3wmtiqoprmmor98" })
})
// aqui se recibe el formulario de nuevo cliente
// y se procesa la creación del cliente nuevo 
app.post('/api/clientes', (req, res)=>{ 
    console.log(req.body) // muestra los datos recibidos del formulario
    let respuesta = Seguridad.nuevoCliente(req.body) //delega a la seguridad para verificar el token 
    if(respuesta.success){ //si todo ok vuelve al menú
        res.render('menu.ejs',{url : "http://localhost:3000", token:"lkjrt4v3wmtiqoprmmor98"})
    }
})

app.get ('/cliente',(req, res)=>{
    res.render('Cliente.ejs',{url : "http://localhost:3000"})
})

/* 
app.post('/nuevocliente',(req, res)=>{
    console.log(req.body)

    Seguridad.nuevoCliente(req.body)

    res.send(JSON.stringify(req.body))
})*/


// --- Turnos ------------------------------------------
app.post('/turnos',(req, res)=>{
    let resultado = Seguridad.dameClientes(req.body)
    if(resultado.success){
    res.render('index.ejs',{url : "http://localhost:3000", token:"lkjrt4v3wmtiqoprmmor98",clientes: resultado.clientes})
}})

app.post('/nuevoturno',(req, res)=>{
    console.log(req.body)
    let respuesta = Seguridad.nuevoTurno(req.body)
    if(respuesta.success){
        res.render('menu.ejs',{url : "http://localhost:3000", token:"lkjrt4v3wmtiqoprmmor98"})
    }
})
// --- Listar turnos ---------------------------------
app.post('/listarturnos', (req, res)=>{
    let resultado = Seguridad.listarTurnos(req.body)
   if(resultado.success){
    res.render('listadoturnos.ejs',{url : "http://localhost:3000", token:"lkjrt4v3wmtiqoprmmor98",turnos: resultado.turnos})
}})

app.post('/eliminarTurno', (req, res)=>{
    console.log(req.body)
    let resultado = Seguridad.eliminarTurno(req.body)
    if(resultado.success){
        res.render('menu.ejs',{url : "http://localhost:3000", token:"lkjrt4v3wmtiqoprmmor98"})
    }
})

// --- Usuarios ------------------------------------------
app.post ('/usuario',(req, res)=>{
    res.render('usuario.ejs',{url : "http://localhost:3000", token:"lkjrt4v3wmtiqoprmmor98"})
})

app.post('/nuevousuario',(req,res)=>{
    Seguridad.nuevoUsuario(req.body)
    res.render('menu.ejs',{url : "http://localhost:3000", token:"lkjrt4v3wmtiqoprmmor98"})
})

app.post('/eliminarusuario',(req, res)=>{
    Seguridad.eliminarUsuario(req.body)
    res.render('menu.ejs',{url : "http://localhost:3000", token:"lkjrt4v3wmtiqoprmmor98"})
})

app.post('/usuarios', (req, res)=>{
    console.log(req.body.token)
    let colUsuarios = Seguridad.dameUsuarios(req.body)
    //res.render('usuarios.ejs',{url : "http://localhost:3000", token:"lkjrt4v3wmtiqoprmmor98", usuarios: colUsuarios})
    res.render('usuarios.ejs',{url : "http://localhost:3000", token:"lkjrt4v3wmtiqoprmmor98", usuarios: colUsuarios})
})    
// --- Volver --------------------------------------------

app.post('/volver', (req, res)=>{
    res.render('menu.ejs',{url : "http://localhost:3000", token:"lkjrt4v3wmtiqoprmmor98"})
})

//-----estilo de la app --------------------------------
app.use('/public/style', express.static(path.join(__dirname, 'style')));

//------ cerrar sesión -----------------------------
app.post('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        return res.status(500).send('Error al cerrar sesión');
      }
      res.redirect('/login'); 
    });
  } else {
    res.redirect('/login');
  }
});

const PORT = 3000
app.listen(PORT, ()=>{console.log(`Escuchando en el puerto  ${PORT} `)})