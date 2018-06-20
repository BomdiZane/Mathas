const express  = require('express'),
	path = require('path'),
	helmet  = require('helmet'),
	hbs = require('express-handlebars'),
	bodyParser = require('body-parser'),
	favicon = require('serve-favicon'),
	logger = require('morgan'),
	glob = require('glob');


module.exports = (app, credentials) => {

	const { handleError } = require(path.normalize(`${__dirname}/utils/serverSideUtils`));
	app.locals.devEnv = credentials.envName == 'development';
	app.locals.appInfo = credentials.appInfo;
  
	app.engine('hbs', hbs({
		extname: 'hbs',
		layoutsDir: path.normalize(`${__dirname}/views/templates/layouts/`),
		defaultLayout: 'main',
		partialsDir: [path.normalize(`${__dirname}/views/templates/partials/`)]
	}));
	app.set('views', path.normalize(`${__dirname}/views/templates`));
	app.set('view engine', 'hbs');

	app.use(helmet()); // Some header security
	app.use(favicon(path.normalize(`${__dirname}/static/images/favicon.ico`)));
	app.use(logger('dev'));
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({
		extended: true
	}));
	app.use(express.static(path.normalize(`${__dirname}/static`)));

	// Import/Use all routes
	let routes = glob.sync(path.normalize(`${__dirname}/routes/*.js`));
	routes.forEach(route => require(route)(app));
	
	app.use((req, res, next) => handleError(req, res, {
		code: 404,
		message: 'Sorry, The page you requested for does not exist!'
	}));

	if (app.locals.devEnv) {
		app.use((err, req, res, next) => {
			console.error(err.stack);
			handleError(req, res);
		});
	}
	else app.use((err, req, res, next) => handleError(req, res));

	return app;
};
