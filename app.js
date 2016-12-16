"use strict";
const express = require('express'),
    path = require('path'),
    logger = require('morgan'),
    debug = require('debug')('taskBoardProject:server'),
    lessMiddleware = require('less-middleware'),
    locale = require("locale"),
    supported = ["ru", "en", 'uk'],
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    moment = require('moment'),
    expressValidator = require('express-validator');


const routes = require('./routes/index');
import {Admin} from "./models/Model";
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
var language;
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(expressValidator());
app.use(cookieParser());
app.use(lessMiddleware(path.join(__dirname, 'public/stylesheets')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(locale(supported));
app.use(function (req, res, next) {
  language = req.locale;
  next();
});
app.locals.performDate = function (data) {
  moment.locale(language);
  return moment(data).format('D MMMM YYYY');
};
//========================= session ================================
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
app.use(session({
  name: 'awesomepizza',
  secret: 'lgetmoremoney',
  cookie: {path: '/', httpOnly: true, secure: false, maxAge: 1000 * 60 * 60 * 24},
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({url: 'mongodb://localhost:27017/awesomepizza'})
}));
//===================================================================
//========================= passport.js =============================

const passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy({
      usernameField: 'username',
      passwordField: 'password'
    },
    function (username, password, done) {
      console.log(username);
      Admin.find({},function (err, all) {
        console.log(all);
      });
      Admin.findOne({email: username}, function (err, admin) {
        "use strict";
        if (err) {
          console.error(err);
          return done(null, false, {message: 'Incorrect username.'});
        }
        else if(admin) {
          console.log(admin);
          if (admin.password !== password) return done(null, false, {message: 'Incorrect password.'});
        }
        else{
          return done(null, false, {message: 'admin not found'});
        }
        return done(null, admin);

      })
    }
));
app.use(passport.initialize());
app.use(passport.session());
app.post('/login', (req, res, next) => {
  console.log(req.body);
  passport.authenticate('local', (err, user) => {
    if (!err) {
      req.session.user = user;
      //res.redirect('/profile');
    }
  })(req, res, next)
});
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  Admin.findOne({email: user.email}, function (err, admin) {
    done(err, admin);
  });
});
//===================================================================
app.all('\/login|\/registerme', (req, res, next) => {
  console.log("middleware work");
  req.checkBody('adminname', 'Invalid postparam').notEmpty().isEmail();
  req.checkBody('password', 'Длина пароля должна быть 4-12 символов').isLength({min: 4, max: 12});
  next();
});

/*
app.all('\/task|\/profile|\/project|\/board|\/contacts', (req, res, next) => {
  if(req.session.adminname){
    next();
  }
  else{
    res.redirect("/admin");
  }
});
*/

app.use('/', routes);
//app.use('/users', users);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;