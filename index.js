const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/agendamento')

app.set('view engine', 'ejs')

app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: false}))

app.get('/', (req, res) => {
    res.send('Deu certo')
})

app.listen(8080, () => {
    console.log('Starting server')
})