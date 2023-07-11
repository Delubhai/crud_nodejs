// Define Common Files
const express = require("express");
let mongoose = require("mongoose"); // mongoose for mongodb
const dotenv = require("dotenv").config();
const cors = require("cors");
let port = process.env.PORT || 8080;
let bodyParser = require("body-parser");
let path = require("path");
let database = require("./config/database");
let logger = require("morgan");
const app = express();
app.disable("x-powered-by");
const common = require('./config/common');

//Cors Policy
let corsOptions = {
  origin: "http://localhost:3000"
};

app.use(cors(corsOptions));

app.use(express.static(__dirname + '/public'));
app.set("views", path.join(__dirname, "views"));
app.set('view engine', 'ejs');


// parse requests of content-type - application/json
app.use(logger("dev"));
app.use(express.json({
  limit: '50mb'
}));

//Swagger Config
const swaggerUi = require('swagger-ui-express');
const swagger = require('./swagger/config');

app.use('/api-docs', swaggerUi.serveWithOptions({
  cacheControl: true
}), swaggerUi.setup(swagger));


//database connection
mongoose.Promise = global.Promise;
mongoose
  .connect(database.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then((res) => common.printLog(null, "Connected to DB Successfully"))
  .catch((err) => common.printLog(null, err));

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({
  extended: true,
  limit: '50mb'
}));
app.use(bodyParser.json({
  type: "application/vnd.api+json"
}));
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type,Accept, Authorization, Content-Length, x-access-token');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

// simple route
app.get("/welcome", (req, res) => {
  res.json({
    message: "Welcome to My Application"
  });
});

let authRouter = require('./app/routes/api/v1');

app.use('/api/v1', authRouter);

// set port, listen for requests
app.listen(port);
common.printLog(null, "App listening on port " + port);