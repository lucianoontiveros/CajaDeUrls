const mongoose = require('mongoose');
mongoose.connect(process.env.SERVIDOR)
.then(() => console.log('CONECTADO CORRECTAMENTE'))
.catch((e) => console.log("Hubo en error al conectar con el servidor" + e))