var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');
var fs = require('fs');
var proc = require('child_process');
var auth = require('./auth/init')(passport);
var cons = require('consolidate');
var MongoStore = require('connect-mongo')(session);

var app = express();

var http = require('http').Server(app);
var io = require('socket.io')();

app.io = io;

var index = require('./routes/index');
var users = require('./routes/users')(passport);
var levels = require('./routes/levels');
var ide = require('./routes/ide')(io);

// view engine setup
app.engine('html', cons.mustache);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

app.use(session({
	secret: auth.key, 
	saveUninitialized: true,
	resave: true,
	store: new MongoStore({
		url: auth.url,
		ttl: 24 * 60 * 60,
		touchAfter: 5 * 60
	})
}));

app.use(passport.initialize());
app.use(passport.session());
mongoose.connect(auth.url);

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/levels', levels);
app.use('/levels/ide', ide);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
