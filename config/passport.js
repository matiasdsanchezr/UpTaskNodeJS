const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

//Referencia al Modelo donde vamos a autenticar
const Usuarios = require("../models/Usuarios");

// local strategy - Login con credenciales propias (usuario y contraseña)
passport.use(
    new LocalStrategy(
        // por default passport espera un usuario y password
        {
            usernameField: "email",
            passwordField: "password",
        },
        async(email, password, done) => {
            try {
                const usuario = await Usuarios.findOne({
                    where: {
                        email: email,
                        activo: 1
                    },
                });
                // Contraseña incorrecta
                if (!usuario.verificarPassword(password)) {
                    return done(null, false, {
                        message: "Contraseña incorrecta",
                    });
                }
                // Contreseña correcta
                return done(null, usuario);
            } catch (error) {
                return done(null, false, {
                    message: "No se encuentra un usuario con ese email",
                });
            }
        }
    )
);

// Serializar el usurario
passport.serializeUser((usuario, callback) => {
    callback(null, usuario);
});

// Deserializar
passport.deserializeUser((usuario, callback) => {
    callback(null, usuario);
});

// Exportar
module.exports = passport;