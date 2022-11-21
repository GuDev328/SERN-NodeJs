const db = require('../models')
const bcrypt = require('bcryptjs')
var userService = require('../services/userService')

let handleLogin = async (req, res) => {

    let email = req.body.email
    let password = req.body.password

    if (!email || !password) {
        return res.status(500).json({
            errCode: 1,
            message: 'Missing input email or password'
        })
    }

    let userData = await userService.handleUserLogin(email, password)
    return res.status(200).json({
        errCode: userData.errCode,
        message: userData.errMessage,
        user: userData.user ? userData.user : {}
    })
}

let handleGetAllUsers = async (req, res) => {
    let id = req.query.id
    if (!id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: 'Missing required parameter',
            users: []
        })
    }
    let users = await userService.getAllUsers(id)

    return res.status(200).json({
        errCode: 0,
        errMessage: 'OK',
        users: users
    })
}

let handleCreateNewUser = async (req, res) => {
    let status = await userService.createNewUser(req.body)
    return res.status(200).json({
        errCode: status.errCode,
        message: status.message
    })
}

let handeDeleteUser = async (req, res) => {
    if (!req.body.id) {
        return res.status(200).json({
            errCode: 1,
            message: 'Missing required parameter'
        })
    }
    let status = await userService.deleteUser(req.body.id)
    return res.status(200).json({
        errCode: status.errCode,
        message: status.message
    })
}

let handeEditUser = async (req, res) => {
    console.log(req.body)
    if (!req.body.id) {
        return res.status(200).json({
            errCode: 1,
            message: 'Missing required parameter'
        })
    }
    let status = await userService.editUser(req.body)
    return res.status(200).json({
        errCode: status.errCode,
        message: status.message
    })
}

let getAllCode = async (req, res) => {
    try {
        let type = req.query.type
        if (type) {
            let data = await userService.getDataAllCode(type)
            return res.status(200).json(data)
        } else {
            return res.status(200).json({
                errCode: 1,
                message: 'Missing require parameter'
            })
        }
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            message: 'Error from sever'
        })
    }
}
module.exports = {
    handleLogin: handleLogin,
    handleGetAllUsers: handleGetAllUsers,
    handleCreateNewUser: handleCreateNewUser,
    handeDeleteUser: handeDeleteUser,
    handeEditUser: handeEditUser,
    getAllCode: getAllCode,
}