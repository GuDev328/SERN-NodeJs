var express = require("express")
var homeController = require("../controllers/homeController")
var userController = require("../controllers/userController")
var doctorController = require("../controllers/doctorController")
var patientController = require("../controllers/patientController")
var specialtyController = require("../controllers/specialtyController")
var clinicController = require("../controllers/clinicController")
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
    router.get('/api/get-list-detail-doctors-by-specialty', doctorController.getListDetailDoctorsBySpecialty)
    router.get("/api/get-appoitment", doctorController.handleGetAppoitment)
    router.post("/api/done-appoitment", doctorController.handleDoneAppoitment)


    router.post("/api/booking-appointment", patientController.handleBookingAppointment)
    router.put('/api/comfirm-booking', patientController.handleConfirmBookingAppointment)

    router.post("/api/create-new-specialty", specialtyController.handleCreateNewSpecialty)
    router.get("/api/get-all-specialty", specialtyController.handleGetAllSpecialty)
    router.delete('/api/delete-specialty', specialtyController.handleDeleteSpecialty)
    router.put("/api/edit-specialty", specialtyController.handleEditSpecialty)

    router.post("/api/create-new-clinic", clinicController.handleCreateNewClinic)
    router.get("/api/get-all-clinic", clinicController.handleGetAllClinic)
    router.delete('/api/delete-clinic', clinicController.handleDeleteClinic)
    router.put("/api/edit-clinic", clinicController.handleEditClinic)
    return app.use("/", router)
}

module.exports = initWebRoutes