var db = require('../models/index')
const nodemailer = require("nodemailer");
import moment from 'moment'
require('dotenv').config()

let sendEmailComfirmBookingAppointment = async (sendData) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_APP, // generated ethereal user
            pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
        },
    });
    if (sendData.patientGender) {
        if (sendData.language === 'vi') {
            if (sendData.patientGender === 'M') sendData.patientGender = 'Nam'
            if (sendData.patientGender === 'F') sendData.patientGender = 'Nữ'
            if (sendData.patientGender === 'O') sendData.patientGender = 'Khác'
        } else {
            if (sendData.patientGender === 'M') sendData.patientGender = 'Male'
            if (sendData.patientGender === 'F') sendData.patientGender = 'Female'
            if (sendData.patientGender === 'O') sendData.patientGender = 'Other'
        }
    }
    let htmlVi = `
    <h3>Xin chào ${sendData.patientName}</h3>
    <p>Bạn nhận được email này vì đã đặt lịch khám bệnh trên BookingCareClone.</p>
    <p>Thông tin đặt lịch: </p>
    <p><b>Bác sĩ: </b> ${sendData.doctorName}</p>
    <p><b>Thời gian: </b> ${sendData.time}  -  ${sendData.date}</p>
    <p><b>Giá khám: </b> ${sendData.price.valueVi}</p>
    <p></p>
    <p><b>Họ tên bệnh nhân: </b> ${sendData.patientName}</p>
    <p><b>Giới tính: </b> ${sendData.patientGender}</p>
    <p><b>Số điện thoại: </b> ${sendData.patientPhoneNumber}</p>
    <p><b>Ngày sinh: </b> ${sendData.patientDob}</p>
    <p><b>Địa chỉ: </b> ${sendData.patientAddress}</p>
    <p><b>Lí do khám bệnh: </b> ${sendData.reason}</p>
    <p>Nếu các thông tin trên là đúng, mời bạn vui lòng bấm vào đường link bên dưới để xác nhận và hoàn tất thủ tục đặt lịch khám bệnh.</p>
    <a href='http://localhost:3000/confirm-booking?bookingId=${sendData.bookingId}&patientId=${sendData.patientId}'>Bấm vào đây</a>
    <h3>Xin chân thành cảm ơn!</h3>`

    let htmlEn = `
    <h3>Dear, ${sendData.patientName}</h3>
    <p>You received this email because you booked a medical appointment on BookingCareClone.</p>
    <p>Booking information: </p>
    <p><b>Doctor: </b> ${sendData.doctorName}</p>
    <p><b>Time: </b> ${sendData.time}  -  ${sendData.date}</p>
    <p><b>Cost: </b> ${sendData.price.valueEn}</p>
    <p></p>
    <p><b>Patient name: </b> ${sendData.patientName}</p>
    <p><b>Gender: </b> ${sendData.patientGender}</p>
    <p><b>Phone number: </b> ${sendData.patientPhoneNumber}</p>
    <p><b>DOB: </b> ${sendData.patientDob}</p>
    <p><b>Address: </b> ${sendData.patientAddress}</p>
    <p><b>Reasons for medical examination: </b> ${sendData.reason}</p>
    <p>If the above information is correct, please click on the link below to confirm and complete the medical appointment booking procedure.</p>
    <a href='http://localhost:3000/confirm-booking?bookingId=${sendData.bookingId}&patientId=${sendData.patientId}'>Click here</a>
    <h3>Sincerely thank!</h3>
    <h3>----------------</h3>
    <h3>BookingCareClone</h3>`
    let htmlContent = sendData.language === 'vi' ? htmlVi : htmlEn
    let subjectContent = sendData.language === 'vi' ? "Xác nhận đặt lịch khám bệnh tại BookingCare" : "Confirm your appointment at BookingCare"

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"BookingCareCloneByGuDev" <foo@example.com>', // sender address
        to: sendData.receiverEmail, // list of receivers
        subject: subjectContent, // Subject line
        html: htmlContent // html body
    });
}

module.exports = {
    sendEmailComfirmBookingAppointment: sendEmailComfirmBookingAppointment
}