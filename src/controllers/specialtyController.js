const { render } = require('ejs');
var db = require('../models/index')
var specialtyService = require('../services/specialtyService.js')

let handleCreateNewSpecialty = async (req, res) => {
    try {
        let response = await specialtyService.createNewSpecialty(req.body)
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

let handleGetAllSpecialty = async (req, res) => {
    try {
        let response = await specialtyService.getAllSpecialty()
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

let handleDeleteSpecialty = async (req, res) => {
    try {
        if (!req.body.id) {
            return res.status(200).json({
                errCode: 1,
                errMessage: 'Missing required parameter'
            })
        }
        let status = await specialtyService.deleteSpecialty(req.body.id)
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
let handleEditSpecialty = async (req, res) => {
    try {
        let status = await specialtyService.editSpecialty(req.body)
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
    handleCreateNewSpecialty: handleCreateNewSpecialty,
    handleGetAllSpecialty: handleGetAllSpecialty,
    handleDeleteSpecialty: handleDeleteSpecialty,
    handleEditSpecialty: handleEditSpecialty
}