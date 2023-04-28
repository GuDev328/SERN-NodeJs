var db = require('../models/index')

let createNewClinic = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (data && data.name) {
                let clinic = await db.Clinic.create({
                    name: data.name
                })
                resolve({
                    errCode: 0,
                    errMessage: 'OK'
                })
            } else {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing require param'
                })
            }

        } catch (error) {
            reject(error)
        }
    })
}

let getAllClinic = () => {
    return new Promise(async (resolve, reject) => {
        try {

            let clinic = await db.Clinic.findAll()
            resolve({
                errCode: 0,
                errMessage: 'OK',
                data: clinic
            })
        } catch (error) {
            reject(error)
        }
    })
}

let deleteClinic = (idClinic) => {
    return new Promise(async (resolve, reject) => {
        try {
            let clinic = await db.Clinic.findOne({
                where: {
                    id: idClinic
                },
                raw: false
            })
            if (clinic) {
                await clinic.destroy()
                resolve({
                    errCode: 0,
                    errMessage: 'Deleted'
                })
            } else {
                resolve({
                    errCode: 2,
                    errMessage: 'Not found Specialty Id'
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}
let editClinic = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let clinic = await db.Clinic.findOne({
                where: {
                    id: data.id
                },
                raw: false
            })
            if (clinic) {
                if (data.isChangeImage || data.isChangeAvt) {
                    if (data.isChangeImage) {
                        clinic.set({
                            name: data.name,
                            address: data.address,
                            contentMarkdown: data.contentMarkdown,
                            contentHTML: data.contentHTML,
                            image: data.image
                        })
                    }

                    if (data.isChangeAvt) {
                        clinic.set({
                            name: data.name,
                            address: data.address,
                            contentMarkdown: data.contentMarkdown,
                            contentHTML: data.contentHTML,
                            avt: data.avt
                        })
                    }

                    await clinic.save()
                    resolve({
                        errCode: 0,
                        errMessage: 'OK'
                    })
                } else {
                    clinic.set({
                        name: data.name,
                        address: data.address,
                        contentMarkdown: data.contentMarkdown,
                        contentHTML: data.contentHTML,

                    })
                    await clinic.save()
                    resolve({
                        errCode: 0,
                        errMessage: 'OK'
                    })
                }

            } else {
                resolve({
                    errCode: 2,
                    errMessage: 'Not found Clinic Id'
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}
module.exports = {
    createNewClinic: createNewClinic,
    getAllClinic: getAllClinic,
    deleteClinic: deleteClinic,
    editClinic: editClinic
}