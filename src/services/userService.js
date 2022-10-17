var db = require('../models/index')
var bcrypt = require('bcryptjs');

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


module.exports = {
    handleUserLogin: handleUserLogin,
}