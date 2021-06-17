const express = require("express");
const routes = require("./routes");
const path = require("path");
const flash = require("connect-flash");
const session = require("express-session");
const cookiesParser = require("cookie-parser");
const passport = require("./config/passport");

// Herramienta para decodificar entidades html
const { decode } = require("html-entities");

// helpers con algunas funciones
const helpers = require("./helpers");

// Crear conexión a la base de datos
const db = require("./config/db");
const { env } = require("process");
require("./models/Proyectos");
require("./models/Tareas");
require("./models/Usuarios");
db.sync().catch((err) => {
    console.log("Error al conectarse con la base de datos.\n".concat(err));
});

// Crear app de Express
const app = express();

// Cargar archivos estáticos
app.use(express.static("public"));

// Habilita Pug como template engine
app.set("view engine", "pug");

// Añadir bodyParser
app.use(express.urlencoded({ extended: true }));

// Añadir carpetas de las vistas
app.set("views", path.join(__dirname, "./views"));

// Agregar flash messages
app.use(flash());

app.use(cookiesParser());

// Session permite navegar paginas sin la necesidad de autenticarse nuevamente
app.use(
    session({
        secret: "secret159753",
        resave: false,
        saveUninitialized: false,
    })
);

app.use(passport.initialize());
app.use(passport.session());

// Pasar vardump a la aplicación
app.use((req, res, next) => {
    res.locals.vardump = helpers.vardump;
    res.locals.decode = decode;
    res.locals.usuario = {...req.user } || null;
    res.locals.mensajes = req.flash();
    next();
});

// Configurar rutas de la aplicacion web
app.use("/", routes());

const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;
app.listen(port, host, () => {
    console.log('El servidor esta funcionando.');
});

// Codigo fuente de referencia:
// https://github.com/juanpablogdl/uptasknode