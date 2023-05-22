var db = require('../models/index')
var emailService = require('../services/emailService')
import moment from 'moment'

let postBooking = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (data && data.patientId
                && data.patientPhoneNumber
                && data.patientName
                && data.patientGender
                && data.patientDob
                && data.patientAddress
                && data.patientReason) {
                let bookingCheck = await db.Booking.findOne({
                    where: {
                        scheduleId: data.scheduleId,
                        patientId: data.patientId
                    }
                })
                if (bookingCheck) {
                    if (bookingCheck.statusId === 'S2') {
                        resolve({
                            errCode: 5,
                            errMessage: 'This appointment has already been booked, Unable to rebook'
                        })
                    }
                    if (bookingCheck.statusId === 'S1') {
                        resolve({
                            errCode: 2,
                            errMessage: 'This appointment has already been booked, Please comfirm this appointment in your email'
                        })
                    }
                } else {
                    let schedule = await db.Schedule.findOne({
                        where: {
                            id: data.scheduleId
                        },
                        raw: false
                    })
                    if (schedule.currentNumber >= schedule.maxNumber) {
                        resolve({
                            errCode: 3,
                            errMessage: 'This time is full patient'
                        })
                    } else {
                        // let newcurrentNumber = schedule.currentNumber + 1;
                        // schedule.set({
                        //     currentNumber: newcurrentNumber
                        // })
                        // await schedule.save()
                        await db.Booking.findOrCreate({
                            where: {
                                scheduleId: data.scheduleId,
                                patientId: data.patientId,
                            },
                            defaults: {
                                statusId: 'S1',
                                scheduleId: data.scheduleId,
                                patientId: data.patientId,
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
                                let userPatient = await db.User.findOne({
                                    where: {
                                        id: data.patientId,
                                    }
                                })
                                let userDoctor = await db.User.findOne({
                                    where: {
                                        id: schedule.doctorId,
                                    },
                                    include: [
                                        {
                                            model: db.DoctorInfo,
                                            include: [
                                                { model: db.Allcode, as: 'priceData', attributes: ['valueEn', 'valueVi'] },
                                            ]
                                        },
                                    ],
                                    raw: true,
                                    nest: true,
                                })
                                let doctorName = data.language === 'vi' ? userDoctor.lastName + ' ' + userDoctor.firstName : userDoctor.firstName + ' ' + userDoctor.lastName
                                let time = await db.Allcode.findOne({
                                    where: { keyMap: schedule.timeType },
                                })
                                await emailService.sendEmailComfirmBookingAppointment({
                                    receiverEmail: userPatient.email,
                                    doctorName: doctorName,
                                    time: time.valueVi,
                                    date: schedule.date,
                                    patientName: data.patientName,
                                    patientGender: data.patientGender,
                                    patientDob: data.patientDob,
                                    patientPhoneNumber: data.patientPhoneNumber,
                                    patientAddress: data.patientAddress,
                                    reason: data.patientReason,
                                    price: userDoctor.DoctorInfo.priceData,
                                    language: data.language,
                                    bookingId: booking.id,
                                    patientId: data.patientId
                                })
                                resolve({
                                    errCode: 0,
                                    errMessage: 'Successful appointment'
                                })
                            } else {
                                if (booking.statusId === 'S2') {
                                    resolve({
                                        errCode: 5,
                                        errMessage: 'This appointment has already been booked, Unable to rebook'
                                    })
                                }
                                if (booking.statusId === 'S1') {
                                    resolve({
                                        errCode: 2,
                                        errMessage: 'This appointment has already been booked, Please comfirm this appointment in your email'
                                    })
                                }
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

let confirmBookingAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (data.patientId == data.userId) {
                let booking = await db.Booking.findOne({
                    where: { id: data.bookingId },
                    raw: false
                })
                if (booking) {
                    if (booking.statusId === 'S1') {
                        let schedule = await db.Schedule.findOne({
                            where: {
                                id: booking.scheduleId
                            },
                            raw: false
                        })
                        if (schedule.currentNumber >= schedule.maxNumber) {
                            resolve({
                                errCode: 5,
                                errMessage: 'Full patient'
                            })
                        } else {
                            let newcurrentNumber = schedule.currentNumber + 1
                            schedule.set({
                                currentNumber: newcurrentNumber
                            })
                            booking.set({
                                statusId: 'S2'
                            })
                            await schedule.save()
                            await booking.save()
                        }

                        resolve({
                            errCode: 0,
                            errMessage: 'Ok'
                        })
                    } else {
                        if (booking.statusId === 'S2') {
                            resolve({
                                errCode: 3,
                                errMessage: 'Confirmed'
                            })
                        } else {
                            resolve({
                                errCode: 4,
                                errMessage: 'Appointment done '
                            })
                        }
                    }
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: 'Booking not found'
                    })
                }
            } else {
                resolve({
                    errCode: 1,
                    errMessage: 'Wrong account'
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}
module.exports = {
    postBooking: postBooking,
    confirmBookingAppointment: confirmBookingAppointment
}