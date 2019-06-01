require("dotenv").config();
require("./config/mongoconfig");
require('./config/passport');

const express = require('express');
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const session = require('express-session');
const passport = require('passport');

//API ROUTERS------------------------------------------------------------------------
const apiUser = require("./api/user-route"); 
const apiMap = require("./api/map-route"); 
const apiComment = require("./api/comment-route"); 

//BASIC SERVER CONFIG----------------------------------------------------------------

app.use(bodyParser.json())
app.use(cors({
  credentials: true,
  origin: ['http://localhost:3000']
}));

// AUTHENTICATION
app.use(session({
  secret:"passport secret",
  resave: true,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

const authRoutes = require('./api/auth-routes');
app.use('/api', authRoutes);

//ROUTES PREFIXING-------------------------------------------------------------------
app.use("/api/user-route", apiUser) 
app.use("/api/map-route", apiMap) 
app.use("/api/comment-route", apiComment) 

app.get("/", (req,res) => {
  res.send("Hello maps!")
})

//LISTENER---------------------------------------------------------------------------
const listener = app.listen(process.env.PORT, () => {
  console.log(`your app started at http://localhost:${listener.address().port}`)
})
