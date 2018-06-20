const express = require('express'),
	router = express.Router(),
	article = require('../models/sampleModel');

module.exports = (app) => app.use('/api', router);

router.get('/', (req, res, next) => {
	article().then(results => {
		res.render('home', {
			title: `${req.app.locals.appInfo.name} - Home`,
			stylesheet: '/css/home.css',
			articles: results
		});
	})
		.catch(e => console.log(e));
});
