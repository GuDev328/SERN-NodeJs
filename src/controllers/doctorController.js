const { render } = require('ejs');
var db = require('../models/index')
var doctorService = require('../services/doctorService')

let getTopDoctor = async (req, res) => {
    try {
        let limit = req.query.limit
        if (!limit) limit = 10
        let topDoctors = await doctorService.getTopDoctor(+limit)
        return res.status(200).json({ topDoctors })
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            message: "Error from sever"
        })
    }
}

let getDoctors = async (req, res) => {
    let id = req.query.id
    if (!id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: 'Missing required parameter',
            users: []
        })
    }
    let doctor = await doctorService.getDoctors(id)

    return res.status(200).json(doctor)
}

let saveInfoDoctor = async (req, res) => {
    try {
        let response = await doctorService.saveInfoDoctor(req.body)
        return res.status(200).json(response)
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            message: "Error from sever "
        })
    }
}

module.exports = {
    getTopDoctor: getTopDoctor,
    getDoctors: getDoctors,
    saveInfoDoctor: saveInfoDoctor,
}