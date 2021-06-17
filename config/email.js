require('dotenv').config({ path: 'variables.env' });

module.exports = {
    user: process.env.NM_USER,
    password: process.env.NM_PASSWORD,
    host: process.env.NM_HOST,
    port: process.env.NM_PORT
}