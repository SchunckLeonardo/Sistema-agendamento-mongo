const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const flash = require('express-flash')
const session = require('express-session')
let cookieParser = require('cookie-parser')

let secret = 'djaidjwa0iadjnonawd-09nawidn0aiwdaw'

const AppointmentService = require('./services/AppointmentService')

mongoose.connect('mongodb://localhost:27017/agendamento')

app.set('view engine', 'ejs')

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser(secret))
app.use(session({
    secret: secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 60000
    }
}))
app.use(flash())

app.get('/', (req, res) => {
    res.send('Deu certo')
})

app.get('/cadastro', (req, res) => {
    res.render('create.ejs')
})

app.post('/create', async (req, res) => {
    let { name, email, cpf, description, date, time } = req.body

    try {
        await AppointmentService.Create(name, email, cpf, description, date, time)
        res.redirect('/')
    } catch (err) {
        console.log(err)
        res.redirect('/cadastro')
    }
})

app.listen(8080, () => {
    console.log('Starting server')
})