class AppointmentFactory {

    Build(simpleAppointment) {
        let id = simpleAppointment._id
        let title = simpleAppointment.name + " - " + simpleAppointment.description
        let day = simpleAppointment.date.getDate() + 1
        let month = simpleAppointment.date.getMonth()
        let year = simpleAppointment.date.getFullYear()
        let hours = simpleAppointment.time.split(':')[0]
        let minutes = simpleAppointment.time.split(':')[1]

        let startDate = new Date(year, month, day, hours, minutes, 0, 0)

        let appoRefined = {
            id,
            title,
            start: startDate,
            end: startDate
        }

        return appoRefined

    }

}

module.exports = new AppointmentFactory()