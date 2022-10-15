var bcrypt = require('bcryptjs');
var db = require('../models/index')


var salt = bcrypt.genSaltSync(10);
let createNewUser = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPasswordFromBcrypt = await hashUserPassword(data.password)
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
            resolve('Create New User Suscessfully. ')
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

let getAllUsers = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll({
                // raw: true: lấy ra chỉ dữ liệu gốc.
                raw: true
            })
            resolve(users)
        } catch (error) {
            reject(error)
        }
    })
}

let getUserInfoById = (userid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: userid },
                raw: true
            })
            if (user) {
                resolve(user)
            } else {
                resolve([])
            }

        } catch (error) {
            reject(error)
        }
    })
}

let updateUserData = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne(
                {
                    where: { id: data.id },
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
                resolve('Update New User Suscessfully. ')
            } else {
                resolve('Not found user to update')
            }
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
            })
            if (user) {
                user.destroy()
            } else {

            }
            resolve()
        } catch (error) {
            reject(error)
        }

    })
}
module.exports = {
    createNewUser: createNewUser,
    getAllUsers: getAllUsers,
    getUserInfoById: getUserInfoById,
    updateUserData: updateUserData,
    deleteUser: deleteUser,
};