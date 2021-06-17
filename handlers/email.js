const nodemailer = require("nodemailer");
const pug = require("pug");
const juice = require("juice");
const htmlToText = require("html-to-text");
const util = require("util");
require("dotenv").config({ path: require("find-config")("variables.env") });

// Configurar correo para usar con nodemailer
let transport = nodemailer.createTransport({
    host: process.env.NM_HOST || "localhost",
    port: process.env.NM_PORT || 587,
    service: process.env.NM_SERVICE,
    auth: {
        user: process.env.NM_USER,
        pass: process.env.NM_PASSWORD,
    },
});

// Generar contenido HTML del correo a enviar
const generarHTML = (archivo, opciones = {}) => {
    const html = pug.renderFile(
        `${__dirname}/../views/emails/${archivo}.pug`,
        opciones
    );
    return juice(html);
};

// Enviar correo
exports.enviar = async(opciones) => {
    const html = generarHTML(opciones.archivo, opciones);
    const text = htmlToText.htmlToText(html);
    let opcionesEmail = {
        from: "Uptask <no-reply@uptask.com>",
        to: opciones.usuario.email,
        subject: opciones.subject,
        text,
        html,
    };

    const enviarEmail = util.promisify(transport.sendMail, opcionesEmail);
    return enviarEmail.call(transport, opcionesEmail);
};