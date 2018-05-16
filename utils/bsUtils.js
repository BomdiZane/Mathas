function textResponse(response, message) {
    response.type('text/plain');
    response.end(message);
}

function renderError(response){
    response.render('error', {
        title: 'Not Found - Bomdi Zane',
        code: '500 - Server error',
        message: 'Sorry, There has been a server error. Please try again soon. <br /> If this is the second time you are seeing this message, please contact our support at...',
        stylesheet: '/css/error.min.css'
    });
}

function handleError(msg, callback) {
    console.error(msg);
    callback('Error');
}

function sanitizeLimits(limits) {
    let limitLenght = limits.length;
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
    textResponse,
    renderError,
    handleError,
    sanitizeLimits
};