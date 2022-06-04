const port = process.env.PORT || 8080;

var path = require('path');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var express = require('express');
var flash = require('express-flash');
var session = require('express-session');
var validator = require('express-validator');
var expressLayout = require('express-ejs-layouts');

var app = express();

//Declaring Routes
var indexRoute = require('./routes/index')

// Setting View
app.set('views' , path.join(__dirname , 'views'));
app.use('view engine' , 'ejs');

//Setting Layout
app.set('layout' , 'layouts/layout');
app.use(expressLayout);

//Setting up Public
app.use(express.static(path.join(__dirname , 'public')))

// Use Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true }));

// Setting up Sessions
app.use(cookieParser());
app.use(session({
  secret: '!nt3rnsD0NtTu4N',
  resave:false,
  saveUninitialized:true,
  cookie: { maxAge:120000 }
}))
app.use(flash());

//Using Route MiddleWare
app.use('/' , indexRoute);


app.listen(port , () => {console.log(`Listening to port... ${port}`);})

module.exports = app;