var db = require('../models/index')
var emailService = require('../services/emailService')
import moment from 'moment'

let postBooking = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
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
                                let userPatient = await db.User.findOne({
                                    where: {
                                        id: data.patientId,
                                    }
                                })
                                let userDoctor = await db.User.findOne({
                                    where: {
                                        id: data.doctorId,
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
                                await emailService.sendEmailComfirmBookingAppointment({
                                    receiverEmail: userPatient.email,
                                    doctorName: doctorName,
                                    time: data.timeData.valueVi,
                                    date: data.date,
                                    patientName: data.patientName,
                                    patientGender: data.patientGender,
                                    patientDob: data.patientDob,
                                    patientPhoneNumber: data.patientPhoneNumber,
                                    patientAddress: data.patientAddress,
                                    reason: data.patientReason,
                                    price: userDoctor.DoctorInfo.priceData,
                                    language: data.language
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

module.exports = {
    postBooking: postBooking
}