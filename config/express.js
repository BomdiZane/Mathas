const express  = require('express'),
      path  = require('path'),
      helmet  = require('helmet'),
      hbs = require('express-handlebars'),
      favicon = require('serve-favicon'),
      logger = require('morgan'),
      glob = require('glob');


module.exports = (app, config) => {

  const { renderError } = require(path.normalize(`${config.root}/utils/bsUtils`));
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
  app.use(express.static(path.normalize(`${config.root}/public`)));
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
