var db = require('../models/index')

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



module.exports = {
    getTopDoctor: getTopDoctor,
}