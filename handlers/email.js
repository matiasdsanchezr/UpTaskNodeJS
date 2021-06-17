const nodemailer = require("nodemailer");
const pug = require("pug");
const juice = require("juice");
const htmlToText = require("html-to-text");
const util = require("util");
require('dotenv').config({ path: require('find-config')('variables.env') })

let transport = nodemailer.createTransport({
    host: process.env.NM_HOST,
    port: process.env.NM_PORT || 25,
    auth: {
        user: process.env.NM_USER,
        pass: process.env.NM_PASSWORD,
    },
});

// generat html
const generarHTML = (archivo, opciones = {}) => {
    const html = pug.renderFile(
        `${__dirname}/../views/emails/${archivo}.pug`,
        opciones
    );
    return juice(html);
};

exports.enviar = async(opciones) => {
    const html = generarHTML(opciones.archivo, opciones);
    const text = htmlToText.htmlToText(html);
    let opcionesEmail = {
        from: "Uptask <no-reply@uptask.com>",
        to: opciones.usuario.email,
        subject: opciones.subject,
        text,
        html
    };

    const enviarEmail = util.promisify(transport.sendMail, opcionesEmail);
    return enviarEmail.call(transport, opcionesEmail);
};