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
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', false);

    // Pass to next layer of middleware
    next();
});

//mitigate man in middle attacks
// if you've 2-3 ways in mitigating a attack using all of them is the best strategy
//Step 1
//Make Sure the Server Uses HTTPS

//Step 2: Avoid session id access by setting secure & http only to true
//Set the session secure to true
//sameSite strict makes sure that the requests are from the referrer site
app.use(
  session({
    secret: "key",
    resave: false,
    saveUninitialized: true,
    cookie: {
      sameSite: "strict",
      secure: true,
      httpOnly: true
    }
  })
);

// redirect HTTP to HTTPS
app.use(
  helmet.hsts({
    maxAge: 60 * 60 * 24 * 365, // 1 year minimum to allow preload
    includeSubDomains: true, // must cover all subdomains to allow preload
    preload: true
  })
);

//mitigate inline scripts
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc:[domain],
      reportUri: "/userroutes/report-violation"
    }
  })
);

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
