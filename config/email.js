require('dotenv').config({ path: require('find-config')('variables.env') })

module.exports = {
    user: process.env.NM_USER,
    pass: process.env.NM_PASSWORD,
    host: process.env.NM_HOST,
    port: process.env.NM_PORT
}