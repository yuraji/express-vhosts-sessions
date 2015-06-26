var express	= require('express'),
	flash = require('connect-flash'),
	morgan = require('morgan'),
	chalk = require('chalk'),
	path = require('path'),
	fs = require('fs');


var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');

var FileStore = require('session-file-store')(session);

var logger = require('morgan');
var tracer = require('tracer').console(
                {
                    format : "{{message}} ({{timestamp}} in {{path}}:{{line}})",
                    dateformat : "HH:MM:ss.L"
                });

var passport = require('passport');
var HashStrategy = require('passport-hash').Strategy;

module.exports = function(config){

	var app = express();

	// app.use(logger('dev'));

	app.set('views', path.join(__dirname, 'views'));
	app.set('view engine', 'jade');

	app.use(express.static(path.join(__dirname, 'public')));


	sessionStore = new FileStore({
		path: path.join( __dirname, 'sessions' )
	});
	// Passport does not directly manage your session, it only uses the session.
	// So you configure session attributes (e.g. life of your session) via express
	// https://www.airpair.com/express/posts/expressjs-and-passportjs-sessions-deep-dive
	var sessionOpts = {
		saveUninitialized: true, // saved new sessions
		resave: false, // do not automatically write to the session store
		domain: config.domain,
		store: sessionStore,
		secret: config.session.secret,
		cookie : { httpOnly: true, maxAge: 2419200000 } // configure when sessions expires
	}

	app.use(bodyParser.json()); // get information from html forms
	app.use(bodyParser.urlencoded({extended: true}))

	app.use(cookieParser(config.session.secret)); // read cookies (needed for auth) // Note Since version 1.5.0, the cookie-parser middleware no longer needs to be used for this module to work. This module now directly reads and writes cookies on req/res. https://github.com/expressjs/session

	app.use(session(sessionOpts));

	app.use(passport.initialize());
	app.use(passport.session());
	app.use(flash());

	app.get('/', function(req, res){
		tracer.log( chalk.bgWhite.blue(config.domain+'/'), 'DBUSER:', config.users[0] );
		tracer.log( chalk.bgWhite.blue(config.domain+'/'), 'USER:', req.user );
		res.render('index', { title: config.title, user: req.user });
	});

	app.get('/logout', function(req, res){
		tracer.log( chalk.bgWhite.blue(config.domain + '/logout') );
		req.logout();
		res.redirect('/');
	});

	app.get('/confirm/:hash', 
		passport.authenticate('hash', { failureRedirect: '/' }),
		function(req, res) {
			tracer.log( chalk.bgWhite.blue(config.domain + '/confirm/:hash') );
			res.redirect('/');
		}
	);

	passport.use(new HashStrategy(
		function(hash, done) {
			tracer.log( chalk.bgWhite.blue(config.domain + '(hash stragegy)'), 'HASH SUBMITTED:', hash);
			// Perhaps find a user from a DB by this hash
			var user = config.users[0];
			tracer.log( chalk.bgWhite.blue(config.domain + '(hash stragegy)'), 'Found DB user:', user);
			return done(null, user);
		}
	));

	passport.serializeUser(function(user, done) {
		done(null, user);
	});

	passport.deserializeUser(function(user, done) {
		done(null, user);
	});



	return app;
}
