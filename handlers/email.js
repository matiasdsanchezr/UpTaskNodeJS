const nodemailer = require("nodemailer");
const pug = require("pug");
const juice = require("juice");
const htmlToText = require("html-to-text");
const util = require("util");
const emailConfig = require("../config/email");
const email = require("../config/email");

let transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: emailConfig.user,
        pass: emailConfig.password,
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
        html,
    };

    const enviarEmail = util.promisify(transport.sendMail, opcionesEmail);
    return enviarEmail.call(transport, opcionesEmail);
};