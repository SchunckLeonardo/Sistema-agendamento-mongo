const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const flash = require('express-flash')
const session = require('express-session')
let cookieParser = require('cookie-parser')

let secret = 'djaidjwa0iadjnonawd-09nawidn0aiwdaw'

const AppointmentService = require('./services/AppointmentService')
const AppointmentFactory = require('./factories/AppointmentFactory')

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
    res.render('index.ejs')
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

app.get('/getcalendar', async (req, res) => {
    let allAppointments = await AppointmentService.GetAll(false)
    res.json(allAppointments)
})

app.get('/appointment/:id', async (req, res) => {
    let id = req.params.id
    let clientAppointment = await AppointmentService.GetById(id)
    let newClient = AppointmentFactory.Build(clientAppointment)
    let dateUpdated = newClient.start.toLocaleDateString('en-GB')
    res.render('client.ejs', { clientAppointment, dateUpdated })
})

app.post('/update', async (req, res) => {
    let { id, email, name, cpf, description, date, time, finished } = req.body
    if(finished == 'on') {
        finished = true
    } else {
        finished = false
    }
    try {
        await AppointmentService.Update(id, name, email, cpf, description, date, time, finished)
        res.redirect('/')
    } catch(err) {
        res.redirect(`/appointment/${id}`)
    }
})

app.get('/list', async (req, res) => {
    let allAppointments = await AppointmentService.GetAll(true)
    let searchRoute = false
    res.render('list.ejs', {allAppointments, searchRoute})
})

app.get('/searchlist', async (req, res) => {
    let query = req.query.search
    let searchRoute = true
    let allAppointments = await AppointmentService.Search(query)
    res.render('list.ejs', {allAppointments, searchRoute})
})

let pollTime = 5000

setInterval( async () => {

    await AppointmentService.SendNotification()

}, pollTime)

app.listen(8080, () => {
    console.log('Starting server')
})