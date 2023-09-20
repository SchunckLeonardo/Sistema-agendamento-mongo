let mongoose = require('mongoose')
let appointmentSchema = require('../models/Appointment')

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
            finished: false
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
        } catch(err) {
            console.log(err)
            return false
        }
    }

}

module.exports = new AppointmentService()