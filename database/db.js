const mongoose = require('mongoose');
require('dotenv').config()


const clientDB = mongoose.connect(process.env.SERVIDOR) /* esto permite conectarme al servidor desde el archivo .env */
.then((m) => {
    console.log('CONECTADO CORRECTAMENTE')
    return m.connection.getClient()
})
.catch((e) => console.log("Hubo en error al conectar con el servidor" + e))

module.exports = clientDB