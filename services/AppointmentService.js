let mongoose = require('mongoose')
let appointmentSchema = require('../models/Appointment')

let AppointmentModel = mongoose.model("Appointments", appointmentSchema)

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
        } catch(err) {
            console.log(err)
            return false
        }
    }

}

module.exports = new AppointmentService()