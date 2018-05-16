const express  = require('express'),
      path  = require('path'),
      // bcrypt  = require('bcrypt'),
      passport  = require('passport'),
      helmet  = require('helmet'),
      hbs = require('express-handlebars'),
      // expressSession = require('express-session'),
      bodyParser = require('body-parser'),
      cookieParser = require('cookie-parser'),
      expressValidator = require('express-validator'),
      favicon = require('serve-favicon'),
      logger = require('morgan'),
      glob = require('glob'),
      compress = require('compression'),
      methodOverride = require('method-override');


module.exports = (app, config) => {

  const renderError = require(path.normalize(`${config.root}/utils/bsUtils`)).renderError;
  app.locals.devEnv = config.envName == 'development';

  app.engine('hbs', hbs({
    extname: 'hbs',
    layoutsDir: path.normalize(`${config.root}/app/views/layouts/`),
    defaultLayout: 'main',
    partialsDir: [path.normalize(`${config.root}/app/views/partials/`)]
  }));

  app.set('views', path.normalize(`${config.root}/app/views`));
  app.set('view engine', 'hbs');

  app.use(helmet());
  app.use(favicon(path.normalize(`${config.root}/public/files/favicon.ico`)));
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(cookieParser(config.security.cookieSecret));
  app.use(compress());
  app.use(express.static(path.normalize(`${config.root}/public`)));
  app.use(methodOverride());
  app.use(expressValidator());
  // app.use(expressSession({
  //   secret: config.security.sessionSecret,
  //   saveUninitialized: false,
  //   resave: false
  // })); //NB...Memory session storage is not recommended for production
  app.use(passport.initialize());
  app.use(passport.session());
  app.use((req, res, next) => {
    res.locals.showTests = app.locals.devEnv && req.query.test === '1';
    next();
  });

  // Import/Use all controllers
  let controllers = glob.sync(path.normalize(`${config.root}/app/controllers/*.js`));
  controllers.forEach(controller => require(controller)(app));

  // 404 handler
  app.use((req, res, next) => {
    res.render('error', {
          title: 'Not Found - Bomdi Zane',
          code: '404 - Not Found',
          message: 'Sorry, The page you requested for does not exist!',
          stylesheet: '/css/error.min.css',
      });
  });

  // 500 handler
  if (app.locals.devEnv) {
    app.use((err, req, res, next) => {
      console.error(err.stack);
      renderError(res);
    });
  }
  else app.use((err, req, res, next) => renderError(res));

  return app;
};
