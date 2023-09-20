const mongoose = require('mongoose')

let appointment = new mongoose.Schema({
    name: String,
    email: String,
    cpf: String,
    description: String,
    date: Date,
    time: String,
    finished: Boolean
})

module.exports = appointment