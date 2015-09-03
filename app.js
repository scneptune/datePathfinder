 var env = require('node-env-file');
    //call in our secret env
    env(__dirname + '/.env');
var fs = require('fs'),
    express = require('express'),
    path = require('path'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser');

var mongoose = require('mongoose');
var session = require('express-session');
var MongoDBSession = require('connect-mongo')(session);

var routes = require('./routes/index');
var users = require('./routes/users');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

mongoose.connect(process.env.MONGO_ADDRESS);

//Mongodb session storing
app.use(session({
  secret: 'dateApp',
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 //1 day
  },
  store: new MongoDBSession({
    mongooseConnection: mongoose.connection
  }),
  resave: true,
  saveUninitialized: false
}));

//serve static files out of public
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
