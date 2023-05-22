const { render } = require('ejs');
var db = require('../models/index')
var CRUDService = require('../services/CRUDService')

let getHomePage = async (req, res) => {
    try {
        let data = await db.User.findAll();
        return res.render('homePage.ejs', {
            data: JSON.stringify(data),
        })
    } catch (error) {
        console.log(error)
    }
}

let getCRUD = (req, res) => {
    return res.render('crud.ejs')
}

let postCRUD = async (req, res) => {
    let message = await CRUDService.createNewUser(req.body)
    return res.send('posted')
}

let displayGetCRUD = async (req, res) => {
    let data = await CRUDService.getAllUsers()
    return res.render('display-crud.ejs', {
        data: data,
    })
}

let editCRUD = async (req, res) => {
    let userid = req.query.id
    if (userid) {
        let data = await CRUDService.getUserInfoById(userid)
        return res.render('editcrud.ejs', {
            data: data,
        });
    } else {
        res.send('have not id to query')
    }
}

let putCRUD = async (req, res) => {
    let data = req.body
    let updateUser = await CRUDService.updateUserData(data)
    return displayGetCRUD(req, res)
}

let deleteCRUD = async (req, res) => {
    let id = req.query.id;
    if (id) {
        await CRUDService.deleteUser(id)
        return res.send('deleted')
    } else {
        return res.send('Not found user id to delete')
    }

}
module.exports = {
    getHomePage: getHomePage,
    getCRUD: getCRUD,
    postCRUD: postCRUD,
    displayGetCRUD: displayGetCRUD,
    editCRUD: editCRUD,
    putCRUD: putCRUD,
    deleteCRUD: deleteCRUD,
}