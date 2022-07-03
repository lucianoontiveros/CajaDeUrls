require('dotenv').config()
const mongoose = require('mongoose');


const clientDB = mongoose
.connect(process.env.URI) /* esto permite conectarme al servidor desde el archivo .env */
.then((m) => {
    console.log('CONECTADO CORRECTAMENTE')
    return m.connection.getClient()
})
.catch((e) => console.log("Hubo en error al conectar con el servidor" + e))

module.exports = clientDB