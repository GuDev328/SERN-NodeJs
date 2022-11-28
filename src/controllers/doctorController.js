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

module.exports = {
    getTopDoctor: getTopDoctor,
}