require('dotenv').config({ silent: true })
var express = require('express');
var ejsLayouts = require('express-ejs-layouts');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var passport = require('./config/ppConfig');
var flash = require('connect-flash');
var app = express();
var isLoggedIn = require('./middleware/isLoggedIn');

if (process.env.NODE_ENV === "test") {
  mongoose.connect(process.env.DATABASE_URL)
} else {
  mongoose.connect(process.env.TEST_DATABASE_URL)
}

app.set('view engine', 'ejs');

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(ejsLayouts);

app.use(function(req, res, next) {
  // before every route, attach the flash messages and current user to res.locals
  res.locals.alerts = req.flash();
  res.locals.currentUser = req.user;
  next();
});

app.get('/', function(req, res) {
  res.render('index');
});

app.use('/auth', require('./controllers/auth'));

app.use(isLoggedIn)
// anything below here requires the user to be logged in

app.get('/profile', function(req, res) {
  res.render('profile');
});

var server = app.listen(process.env.PORT);

module.exports = server;
