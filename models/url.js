const mongoose = require('mongoose')
const {Schema} = mongoose
var uniqid = require('uniqid')

const urlSchema = new Schema ({
    origin: {
        type: String,
        unique: true,
        required: true,
    },
    shortURL: {
        type: String,
        unique: true,
        required: true,
        id: uniqid(),
    },
})

const Url = mongoose.model('Url', urlSchema)
module.exports = Url