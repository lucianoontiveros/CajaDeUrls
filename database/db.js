const mongoose = require('mongoose');
mongoose.connect(process.env.SERVIDOR) /* esto permite conectarme al servidor desde el archivo .env */
.then(() => console.log('CONECTADO CORRECTAMENTE'))
.catch((e) => console.log("Hubo en error al conectar con el servidor" + e))