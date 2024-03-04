var express = require("express");
var bodyPasrser = require("body-parser");
var viewEngine = require("./config/viewEngine");
var connectDB = require("./config/connectDB");
var initWebRoutes = require("./route/web");
var cors = require("cors");
require("dotenv").config();

let app = express();
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader("Access-Control-Allow-Origin", "*");

    // Request methods you wish to allow
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );

    // Request headers you wish to allow
    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With,content-type"
    );

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader("Access-Control-Allow-Credentials", true);

    // Pass to next layer of middleware
    next();
});
// app.use(bodyPasrser.json())
// app.use(bodyPasrser.urlencoded({ extended: true }))

app.use(bodyPasrser.json({ limit: "50mb" }));
app.use(bodyPasrser.urlencoded({ limit: "50mb", extended: true }));

app.use(cors({ origin: true }));
viewEngine(app);
initWebRoutes(app);

connectDB();

let port = process.env.PORT;
app.listen(port, () => {
    console.log("Port " + port + " is running");
});
