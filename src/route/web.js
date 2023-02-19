var express = require("express")
var homeController = require("../controllers/homeController")
var userController = require("../controllers/userController")
var doctorController = require("../controllers/doctorController")
var patientController = require("../controllers/patientController")
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
    router.get('/api/allcode', userController.getAllCode)

    router.get('/api/get-top-doctor', doctorController.getTopDoctor)
    router.get('/api/get-doctors', doctorController.getDoctors)
    router.post('/api/save-info-doctor', doctorController.saveInfoDoctor)
    router.get('/api/get-detail-doctors', doctorController.getDetailDoctors)
    router.post('/api/save-schedule', doctorController.handleSaveSchedule)
    router.get("/api/get-schedule", doctorController.handleGetSchedule)

    router.post("/api/booking-appointment", patientController.handleBookingAppointment)
    return app.use("/", router)
}

module.exports = initWebRoutes