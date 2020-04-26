//import express
const express = require('express');
//import helmet to allow browser to redirect http to https by enabling HSTS
const helmet = require('helmet')
//To parse the body while making mongoose requests
const bodyParser = require('body-parser');
//To access sub routers
const router_redirect = express.Router();
//To create a express session
var session = require('express-session');
//To the parse teh cookie
var cookieParser = require('cookie-parser');
//To enable cross origin requests
var cors=require('cors');
//To mitigate csrf attacks
const csurf = require('csurf')
// phase of the development
const phase = "dev"
// domain of the server site
var domain = "http://localhost:8080"
// url of the referrer site
var referrer_domain = "http://localhost:3000"
// create a express instance
const app = express();

//middlewares
//enabling cors requests from the clients
app.use(express.urlencoded({ extended: true }));
app.use(cors());

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
