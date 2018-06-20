function handleError(request, response, error){
	if (!response) return console.log('no response provided');

	if (!error || typeof(error) !== 'object' || !error.code)
		return response.render('error', {
			title: `Not Found - ${request.app.locals.appInfo.name}`,
			code: '500 - Server error',
			message: 'Sorry, There has been a server error. Please try again soon. <br /> If this is the second time you are seeing this message, please contact our support at...',
			stylesheet: '/css/error.css'
		});
	
	let options = {
		message: error.message,
		stylesheet: '/css/error.css',
	};

	switch (error.code) {
	case 404:
		options.code = '404 - Not Found';
		options.title = `Not Found - ${request.app.locals.appInfo.name}`;
		break;
		
	default:
		break;
	}

	response.render('error', options);
}

function textResponse(response, message) {
	response.type('text/plain');
	response.end(message);
}

function sanitizeLimits(limits) {
	let limitLenght = limits.length,
		allInts;
	if (Array.isArray(limits) && limitLenght < 3 && limitLenght > 0) {
		allInts = true;
		for (let i = 0; i < limitLenght; i++) {
			if (typeof(limits[i]) !== 'number') {
				allInts = false;
				break;
			}
		}
		if (allInts) return true;
		else return false;
	}
}

module.exports = {
	handleError,
	textResponse,
	sanitizeLimits
};