const { render } = require("ejs");
var db = require("../models/index");
var patientService = require("../services/patientService");

let handleBookingAppointment = async (req, res) => {
    try {
        let response = await patientService.postBooking(req.body);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            message: "Error from sever ",
        });
    }
};

let handleConfirmBookingAppointment = async (req, res) => {
    try {
        let response = await patientService.confirmBookingAppointment(req.body);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            message: "Error from sever ",
        });
    }
};
module.exports = {
    handleBookingAppointment: handleBookingAppointment,
    handleConfirmBookingAppointment: handleConfirmBookingAppointment,
};
