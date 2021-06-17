const { Sequelize } = require("sequelize");
require('dotenv').config({ path: 'variables.env' });

// Conectar a la base de datos
const sequelize = new Sequelize(process.env.DB_URI, {
    dialect: "postgres",
    protocol: "postgres",
    logging: false,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
    },
});

module.exports = sequelize;

// Probar conexion a la base de datos
async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log("Conectado a la base de datos.");
    } catch (error) {
        console.error("Error al conectar con la base de datos.", error);
    }
}

module.exports.testConnection = testConnection;