const express = require('express'),
	router = express.Router();

module.exports = app => app.use('/', router);

router.get('/', (req, res, next) => {
	res.render('home', {
		title: `${req.app.locals.appInfo.name} - Home`,
		stylesheet: '/css/home.css'
	});
});
