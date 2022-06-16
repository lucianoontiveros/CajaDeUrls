const mongoose = require('mongoose')

mongoose.connect(process.env.URI)
.then(() => console.log(" ya se inicio tu mondongo"))
.catch((e) => console.log("falló la conexión" + e))