const { string } = require('joi')
const mongoose = require('mongoose')

let loginSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    name : String,
    password : String,
    email : String
})

module.exports = mongoose.model('main', loginSchema)