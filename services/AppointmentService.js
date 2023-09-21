let mongoose = require('mongoose')
let appointmentSchema = require('../models/Appointment')
let mailer = require('nodemailer')

let AppointmentModel = mongoose.model("Appointments", appointmentSchema)

let AppointmentFactory = require('../factories/AppointmentFactory')

class AppointmentService {

    async Create(name, email, cpf, description, date, time) {
        let newAppointment = new AppointmentModel({
            name,
            email,
            cpf,
            description,
            date,
            time,
            finished: false,
            notified: false
        })

        try {
            await newAppointment.save()
            console.log("Nova consulta criada")
            return true
        } catch (err) {
            console.log(err)
            return false
        }
    }

    async GetAll(showFinished) {
        try {
            if (showFinished) {
                return await AppointmentModel.find()
            } else {
                let allAppointments = await AppointmentModel.find({ finished: false })
                let arrayAppointments = []
                allAppointments.forEach(appointment => {
                    if (appointment.date != undefined) {
                        arrayAppointments.push(AppointmentFactory.Build(appointment))
                    }
                })
                return arrayAppointments
            }
        } catch (err) {
            console.log(err)
            return {}
        }
    }

    async GetById(id) {
        try {
            return await AppointmentModel.findById(id)
        } catch (err) {
            console.log(err)
        }
    }

    async Update(id, name, email, cpf, description, date, time, finished) {
        try {
            await AppointmentModel.findByIdAndUpdate(id, {
                name,
                email,
                cpf,
                description,
                date,
                time,
                finished
            })
            return true
        } catch (err) {
            console.log(err)
            return false
        }
    }

    async Search(query) {
        try {
            let appo = await AppointmentModel.find().or([{ email: query }, { cpf: query }])
            return appo
        } catch (err) {
            console.log(err)
            return []
        }
    }

    async SendNotification() {
        let allAppointments = await this.GetAll(false)

        let transporter = mailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 587,
            auth: {
                user: "ec9db8e8ea0ae2",
                pass: "a199573ddb1e79"
            }
        })

        allAppointments.forEach(async appointment => {
            let date = appointment.start
            let hour = 1000 * 60 * 60
            let gap = date - Date.now()

            if (gap <= hour) {
                if (!appointment.notified) {
                    transporter.sendMail({
                        from: "Leonardo Rainha <schunckrainhaleonardo@gmail.com>",
                        to: appointment.email,
                        subject: "Sua consulta vai acontecer em breve",
                        text: "Daqui 1 hora será a sua consulta. Fique esperto!"
                    })
                    console.log("O paciente foi notificado!")
                    await AppointmentModel.findByIdAndUpdate(appointment.id, { notified: true })
                }
            }

        })

    }

}

module.exports = new AppointmentService()