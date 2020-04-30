//import express
const express = require('express');
//To parse the body while making mongoose requests
const bodyParser = require('body-parser');
//To access sub routers
const router_redirect = express.Router();
//To enable cross origin requests
var cors=require('cors');
// phase of the development
const phase = "dev"
// domain of the server site
var domain = "http://localhost:8080"
// url of the referrer site
var referrer_domain = "http://localhost:3000"
// create a express instance
const app = express();

//middlewares
//enabling cors requests from the ui
app.use(express.urlencoded({ extended: true }));
app.use(cors());
// Add headers
app.use(function (req, res, next) {
    if(phase == "dev"){
      // Request methods you wish to allow
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    }else{
      // Website you wish to allow to connect
      res.setHeader('Access-Control-Allow-Origin', referrer_domain);
      // Request methods you wish to allow
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST,PUT');
    }
    // Request headers you wish to allow
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', false);
    // Pass to next layer of middleware
    next();
});

//bodyparser middleware
app.use(bodyParser.json());
app.use(bodyParser.json({type: ["json", "application/csp-report"],limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));

//routes
//connect public folder
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
});
app.use('/userroutes',require('./routes/userroutes.js'));

//listen on port
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log('Express server listening on port', port)
});

exports = module.exports = {
  portNumber : port
}
