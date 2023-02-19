var db = require('../models/index')
import moment from 'moment'
let getTopDoctor = async (limit) => {
    return new Promise(async (resolve, reject) => {
        try {
            let topDoctor = await db.User.findAll({
                attributes: {
                    exclude: ['password']
                },
                include: [
                    { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                    { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] },
                    { model: db.Allcode, as: 'roleData', attributes: ['valueEn', 'valueVi'] }

                ],
                raw: true,
                nest: true,
                limit: limit,
                where: { roleId: 'R2' }
            })
            resolve({
                errCode: 0,
                data: topDoctor
            })
        } catch (error) {
            reject(error)
        }
    })
}

let getDoctors = (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = ''
            if (doctorId === 'ALL') {
                data = await db.User.findAll({
                    attributes: {
                        exclude: ['password']
                    },
                    where: {
                        roleId: 'R2'
                    },
                });
                resolve({
                    data: data,
                    errCode: 0,
                    errMessage: "OK"
                })
            } else {
                data = await db.User.findOne({
                    where: {
                        id: doctorId,
                        roleId: 'R2'
                    },
                    attributes: {
                        exclude: ['password']
                    },
                })
                if (!data) {
                    resolve({
                        data: data,
                        errCode: 1,
                        errMessage: "The doctor Id is not exist"
                    })
                } else {
                    resolve({
                        data: data,
                        errCode: 0,
                        errMessage: "OK"
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}

let saveInfoDoctor = (inputInfo) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputInfo.doctorId || !inputInfo.contentMarkdown || !inputInfo.contentHTML
                || !inputInfo.addressClinic || !inputInfo.nameClinic || !inputInfo.priceId
                || !inputInfo.provinceId
                || !inputInfo.paymentId
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing require parameter'
                })
            } else {
                if (!inputInfo.markdownId) {
                    await db.Markdown.create({
                        contentHTML: inputInfo.contentHTML,
                        contentMarkdown: inputInfo.contentMarkdown,
                        description: inputInfo.description,
                        doctorId: inputInfo.doctorId
                    })
                } else {
                    let markdown = await db.Markdown.findOne(
                        {
                            where: { id: inputInfo.markdownId },
                            raw: false
                        },
                    )
                    if (markdown) {
                        markdown.set({
                            contentHTML: inputInfo.contentHTML,
                            contentMarkdown: inputInfo.contentMarkdown,
                            description: inputInfo.description,
                            doctorId: inputInfo.doctorId
                        })
                        await markdown.save()
                    }
                }
                let doctorInfo = await db.DoctorInfo.findOne({
                    where: { doctorId: inputInfo.doctorId },
                    raw: false
                })
                if (!doctorInfo) {
                    await db.DoctorInfo.create({
                        doctorId: inputInfo.doctorId,
                        priceId: inputInfo.priceId,
                        provinceId: inputInfo.provinceId,
                        paymentId: inputInfo.paymentId,
                        nameClinic: inputInfo.nameClinic,
                        addressClinic: inputInfo.addressClinic,
                        note: inputInfo.note
                    })
                } else {
                    doctorInfo.set({
                        priceId: inputInfo.priceId,
                        provinceId: inputInfo.provinceId,
                        paymentId: inputInfo.paymentId,
                        nameClinic: inputInfo.nameClinic,
                        addressClinic: inputInfo.addressClinic,
                        note: inputInfo.note
                    })
                    await doctorInfo.save()
                }

                resolve({
                    errCode: 0,
                    errMessage: "Save info doctor sucsess"
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

let getDetailDoctors = (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.User.findOne({
                attributes: {
                    exclude: ['password']
                },
                include: [
                    { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                    { model: db.Markdown },
                    {
                        model: db.DoctorInfo,
                        include: [
                            { model: db.Allcode, as: 'priceData', attributes: ['valueEn', 'valueVi'] },
                            { model: db.Allcode, as: 'paymentData', attributes: ['valueEn', 'valueVi'] },
                            { model: db.Allcode, as: 'provinceData', attributes: ['valueEn', 'valueVi'] }
                        ]
                    },

                ],
                raw: true,
                nest: true,
                where: { id: doctorId, roleId: 'R2' }
            })
            if (!data) {
                resolve({
                    errCode: 1,
                    errMessage: "The doctor Id is not exist"
                })
            } else {
                if (data.image) {
                    let imgBase64 = new Buffer(data.image, 'base64').toString('binary')
                    data.image = imgBase64
                }
                resolve({
                    data: data,
                    errCode: 0,
                    errMessage: "OK"
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

let handleSaveSchedule = (data) => {
    return new Promise(async (resolve, reject) => {
        try {

            if (!data.result) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required param'
                })
            } else {
                let schedule = data.result
                await db.Schedule.destroy({
                    where: {
                        doctorId: schedule[0].doctorId,
                        date: schedule[0].date
                    }
                })
                await db.Schedule.bulkCreate(schedule)
            }
        } catch (error) {
            reject(error)
        }
    })
}

let getSchedule = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required param"
                })
            } else {
                let dataa = await db.Schedule.findAll({
                    where: {
                        doctorId: doctorId * 1,
                        date: date
                    },
                    attributes: {
                        exclude: ['createdAt', 'updatedAt']
                    },
                    include: [
                        { model: db.Allcode, as: 'timeData', attributes: ['valueEn', 'valueVi'] }
                    ],
                    raw: true,
                    nest: true,
                })
                if (!dataa) dataa = []
                resolve({
                    errCode: 0,
                    data: dataa
                })
            }

        } catch (error) {
            reject(error)
        }
    })
}

module.exports = {
    getTopDoctor: getTopDoctor,
    getDoctors: getDoctors,
    saveInfoDoctor: saveInfoDoctor,
    getDetailDoctors: getDetailDoctors,
    handleSaveSchedule: handleSaveSchedule,
    getSchedule: getSchedule
}