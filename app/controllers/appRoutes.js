const express = require('express'),
      router = express.Router(),
      path = require('path'),
      config = require(path.normalize(`${__dirname}/../../config/credentials`)),
      { textResponse } = require(path.normalize(`${config.root}/utils/bsUtils`)),
      { renderError } = require(path.normalize(`${config.root}/utils/bsUtils`)),
      article = require('../models/sampleModel');

module.exports = (app) => app.use('/', router);

router.get('/', (req, res, next) => {
  article().then(results => {
    res.render('homePage', {
      title: 'Bomdi Zane - App Routes',
      stylesheet: '/css/homePage.min.css',
      articles: results
    });
  })
  .catch(e => console.log(e));
});
