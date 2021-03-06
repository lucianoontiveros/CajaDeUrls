const mongoose = require('mongoose')
const {Schema} = mongoose

const urlSchema = new Schema ({
    origin: {
        type: String,
        unique: false,
        required: true
    },
    shortURL: {
        type: String,
        unique: true,
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        require: true,
    }
})


const Url = mongoose.model('Url', urlSchema)  /* El nombre 'Url' es el de la base de datos */
module.exports = Url /* cada vez que exporto es porque va para algun lado  */