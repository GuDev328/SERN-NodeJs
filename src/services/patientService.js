var db = require('../models/index')
import moment from 'moment'

let postBooking = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log(data)
            if (data && data.doctorId
                && data.patientId
                && data.timeType
                && data.date
                && data.patientPhoneNumber
                && data.patientName
                && data.patientGender
                && data.patientDob
                && data.patientAddress
                && data.patientReason) {
                let bookingCheck = await db.Booking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        patientId: data.patientId,
                        date: data.date,
                        timeType: data.timeType
                    }
                })
                if (bookingCheck) {
                    resolve({
                        errCode: 2,
                        errMessage: 'This appointment has already been booked, Unable to rebook'
                    })
                } else {
                    let schedule = await db.Schedule.findOne({
                        where: {
                            doctorId: data.doctorId,
                            date: data.date,
                            timeType: data.timeType
                        },
                        raw: false
                    })
                    if (schedule.currentNumber >= schedule.maxNumber) {
                        resolve({
                            errCode: 3,
                            errMessage: 'This time is full patient'
                        })
                    } else {
                        let newcurrentNumber = schedule.currentNumber + 1;
                        schedule.set({
                            currentNumber: newcurrentNumber
                        })
                        await schedule.save()
                        await db.Booking.findOrCreate({
                            where: {
                                doctorId: data.doctorId,
                                patientId: data.patientId,
                                date: data.date,
                                timeType: data.timeType
                            },
                            defaults: {
                                statusId: 'S1',
                                doctorId: data.doctorId,
                                patientId: data.patientId,
                                date: data.date,
                                timeType: data.timeType
                            }
                        }).then(async ([booking, created]) => {
                            if (created) {
                                await db.PatientInfo.create({
                                    bookingId: booking.id,
                                    name: data.patientName,
                                    gender: data.patientGender,
                                    dob: data.patientDob,
                                    phoneNumber: data.patientPhoneNumber,
                                    address: data.patientAddress,
                                    reason: data.patientReason,
                                })
                                resolve({
                                    errCode: 0,
                                    errMessage: 'Successful appointment'
                                })
                            } else {
                                resolve({
                                    errCode: 2,
                                    errMessage: 'This appointment has already been booked, Unable to rebook'
                                })
                            }
                        });
                    }

                }
            } else {
                resolve({
                    errCode: 4,
                    errMessage: 'Missing require param'
                })
            }

        } catch (error) {
            reject(error)
        }
    })
}

module.exports = {
    postBooking: postBooking
}