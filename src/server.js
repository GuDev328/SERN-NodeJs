var express = require("express")
var bodyPasrser = require("body-parser")
var viewEngine = require("./config/viewEngine")
var connectDB = require("./config/connectDB")
var initWebRoutes = require("./route/web")
require('dotenv').config()

let app = express()

app.use(bodyPasrser.json())
app.use(bodyPasrser.urlencoded({ extended: true }))

viewEngine(app)
initWebRoutes(app)

connectDB();

let port = process.env.PORT;
app.listen(port, () => {
    console.log("Port " + port + " is running")
})