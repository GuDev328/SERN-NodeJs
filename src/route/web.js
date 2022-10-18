var express = require("express")
var homeController = require("../controllers/homeController")
var userController = require("../controllers/userController")
let router = express.Router()

let initWebRoutes = (app) => {
    router.get('/', homeController.getHomePage)
    router.get('/crud', homeController.getCRUD)
    router.post('/post-crud', homeController.postCRUD)
    router.get('/get-crud', homeController.displayGetCRUD)
    router.get('/edit-crud', homeController.editCRUD)
    router.post('/put-crud', homeController.putCRUD)
    router.get('/delete-crud', homeController.deleteCRUD)

    router.post('/api/login', userController.handleLogin)
    router.get('/api/get-all-users', userController.handleGetAllUsers)
    router.post('/api/create-new-user', userController.handleCreateNewUser)
    router.delete('/api/delete-user', userController.handeDeleteUser)
    router.put('/api/edit-user', userController.handeEditUser)

    return app.use("/", router)
}

module.exports = initWebRoutes