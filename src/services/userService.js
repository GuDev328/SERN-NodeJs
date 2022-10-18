var db = require('../models/index')
var bcrypt = require('bcryptjs');

var salt = bcrypt.genSaltSync(10);
let createNewUser = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPasswordFromBcrypt = await hashUserPassword(data.password)
            let findUser = await db.User.findOne({
                where: {
                    email: data.email
                }
            })
            if (!findUser) {
                await db.User.create({
                    email: data.email,
                    password: hashPasswordFromBcrypt,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address: data.address,
                    phoneNumber: data.phoneNumber,
                    gender: data.gender === '1' ? true : false,
                    roleId: data.roleId,
                })
                resolve({
                    errCode: 0,
                    message: 'OK'
                })
            } else {
                resolve({
                    errCode: 1,
                    message: 'Email is exist in system'
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword)
        } catch (error) {
            reject(error)
        }

    })
}

let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {}
            let isExist = await checkUserEmail(email)
            if (isExist) {
                let user = await db.User.findOne({
                    where: { email: email },
                    attributes: ['email', 'password', 'roleId'],
                    raw: true
                })
                if (user) {
                    let checkPassword = await bcrypt.compareSync(password, user.password)
                    delete user.password
                    if (checkPassword) {
                        userData.errCode = 0,
                            userData.errMessage = 'OK',
                            userData.user = user
                    } else {
                        userData.errCode = 3,
                            userData.errMessage = 'Wrong password'
                    }
                } else {
                    userData.errCode = 2,
                        userData.errMessage = 'User not found'
                }
            } else {
                userData.errCode = 1
                userData.errMessage = 'Your email is not exist in system, Try other email.'
            }
            resolve(userData)
        } catch (error) {
            reject(error)
        }
    })
}

let checkUserEmail = (userEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: {
                    email: userEmail,
                }
            })
            if (user) {
                resolve(true)
            } else {
                resolve(false)
            }
        } catch (error) {
            reject(error)
        }
    })
}

let getAllUsers = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = ''
            if (userId === 'ALL') {
                data = await db.User.findAll({
                    attributes: {
                        exclude: ['password']
                    },
                });
            } else {
                data = await db.User.findOne({
                    where: {
                        id: userId
                    },
                    attributes: {
                        exclude: ['password']
                    },
                })
            }

            resolve(data)
        } catch (error) {
            reject(error)
        }
    })
}

let deleteUser = (idUser) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: {
                    id: idUser
                },
                raw: false
            })
            if (user) {
                await user.destroy()
                resolve({
                    errCode: 0,
                    message: 'Deleted'
                })
            } else {
                resolve({
                    errCode: 2,
                    message: 'Not found User Id'
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

let editUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 3,
                    message: 'Missing required parameter'
                })
            }
            let user = await db.User.findOne(
                {
                    where: { id: data.id },
                    raw: false
                },
            )
            if (user) {
                user.set({
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address: data.address,
                    phoneNumber: data.phoneNumber,
                    gender: data.gender === '1' ? true : false
                })

                await user.save()
                resolve({
                    errCode: 0,
                    message: 'OK'
                })
            } else {
                resolve({
                    errCode: 2,
                    message: 'User not found'
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}
module.exports = {
    handleUserLogin: handleUserLogin,
    getAllUsers: getAllUsers,
    createNewUser: createNewUser,
    deleteUser: deleteUser,
    editUser: editUser
}