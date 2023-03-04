var db = require('../models/index')

let createNewSpecialty = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (data && data.name) {
                let specialty = await db.Specialty.create({
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

let getAllSpecialty = () => {
    return new Promise(async (resolve, reject) => {
        try {

            let specialty = await db.Specialty.findAll()
            resolve({
                errCode: 0,
                errMessage: 'OK',
                data: specialty
            })
        } catch (error) {
            reject(error)
        }
    })
}

let deleteSpecialty = (idSpecialty) => {
    return new Promise(async (resolve, reject) => {
        try {
            let specialty = await db.Specialty.findOne({
                where: {
                    id: idSpecialty
                },
                raw: false
            })
            if (specialty) {
                await specialty.destroy()
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
let editSpecialty = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let specialty = await db.Specialty.findOne({
                where: {
                    id: data.id
                },
                raw: false
            })
            if (specialty) {
                if (data.isChangeImage) {
                    specialty.set({
                        name: data.name,
                        contentMarkdown: data.contentMarkdown,
                        contentHTML: data.contentHTML,
                        image: data.image
                    })
                    await specialty.save()
                    resolve({
                        errCode: 0,
                        errMessage: 'OK'
                    })
                } else {
                    specialty.set({
                        name: data.name,
                        contentMarkdown: data.contentMarkdown,
                        contentHTML: data.contentHTML,
                    })
                    await specialty.save()
                    resolve({
                        errCode: 0,
                        errMessage: 'OK'
                    })
                }

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
module.exports = {
    createNewSpecialty: createNewSpecialty,
    getAllSpecialty: getAllSpecialty,
    deleteSpecialty: deleteSpecialty,
    editSpecialty: editSpecialty
}