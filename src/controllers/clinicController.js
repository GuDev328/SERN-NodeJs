const { render } = require('ejs');
var db = require('../models/index')
var clinicService = require('../services/clinicService.js')

let handleCreateNewClinic = async (req, res) => {
    try {
        let response = await clinicService.createNewClinic(req.body)
        return res.status(200).json({
            errCode: response.errCode,
            errMessage: response.errMessage
        })
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            message: "Error from sever "
        })
    }
}

let handleGetAllClinic = async (req, res) => {
    try {
        let response = await clinicService.getAllClinic()
        return res.status(200).json({
            errCode: response.errCode,
            errMessage: response.errMessage,
            data: response.data
        })
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            message: "Error from sever "
        })
    }
}

let handleDeleteClinic = async (req, res) => {
    try {
        if (!req.body.id) {
            return res.status(200).json({
                errCode: 1,
                errMessage: 'Missing required parameter'
            })
        }
        let status = await clinicService.deleteClinic(req.body.id)
        return res.status(200).json({
            errCode: status.errCode,
            errMessage: status.errMessage
        })
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from sever "
        })
    }
}
let handleEditClinic = async (req, res) => {
    try {
        let status = await clinicService.editClinic(req.body)
        return res.status(200).json({
            errCode: status.errCode,
            errMessage: status.errMessage
        })
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from sever "
        })
    }
}
module.exports = {
    handleCreateNewClinic: handleCreateNewClinic,
    handleGetAllClinic: handleGetAllClinic,
    handleDeleteClinic: handleDeleteClinic,
    handleEditClinic: handleEditClinic
}