const express = require('express'),
      router = express.Router(),
      article = require('../models/sampleModel');

module.exports = (app) => app.use('/', router);

router.get('/', (req, res, next) => {
  article().then(results => {
    res.render('homePage', {
      title: 'Mathas - Home',
      stylesheet: '/css/bundle.css',
      articles: results
    });
  })
  .catch(e => console.log(e));
});
