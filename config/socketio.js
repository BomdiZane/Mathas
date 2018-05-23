const options = {
    operators : ['+', '-', '*', '/'],
    minValue : 1,
    maxValue : 10
};

let expectedResponse;

function getRandomNumber(max, min = 0) {
    if (!max || typeof(max) !== 'number' || typeof(min) !== 'number') return 0;
    return Number((Math.random() * (max - min) + min).toFixed(2));
}

function getRandomInt(max, min = 0){
    if (!max || typeof(max) !== 'number' || typeof(min) !== 'number') return 0;

    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getFakeAnswer(operator) {
    let answer;

    // Potential answer depends on the operator.
    // Just to make the game a bit more realistic/interesting/difficult in some sense
    switch(operator){
        case '+': answer = getRandomNumber(options.maxValue * 2, options.minValue * 2); break;
        case '-': answer = getRandomNumber(options.maxValue - options.minValue); break;
        case '*': answer = getRandomNumber(Math.pow(options.maxValue, 2), Math.pow(options.minValue, 2)); break;
        default: answer = getRandomNumber(options.maxValue / options.minValue, options.minValue / options.maxValue);
            break;
    }

    expectedResponse = 'no';
    return parseFloat(answer);
}

function getRealAnswer(operand1, operand2, operator) {
    let answer;

    switch(operator){
        case '+': answer = operand1 + operand2; break;
        case '-': answer = operand1 - operand2; break;
        case '*': answer = operand1 * operand2; break;
        default: answer = operand1 / operand2; break;
    }

    expectedResponse = 'yes';
    return parseFloat(answer.toFixed(2));
}

function createQuestion() {
    let operand1 = getRandomNumber(options.maxValue, options.minValue),
        operand2 = getRandomNumber(options.maxValue, options.minValue),
        operator = options.operators[getRandomInt(options.operators.length-1)],
        coin = getRandomInt(10),
        answer = coin > 5 ? getRealAnswer(operand1, operand2, operator) : getFakeAnswer(operator);

    return { operand1, operand2, operator, answer, expectedResponse };
}

function createConnection(http) {

    let io = require('socket.io')(http),
        roundIsClosed = true,
        roundCheckInterval,
        roundInterval,
        numberOfConnections = 0;

    startIntervals();

    io.on('connection', socket => {
        io.emit('player update', ++numberOfConnections);
        socket.on('answer', answer => { if (!roundIsClosed) closeRound(); });
        socket.on('disconnect', () => socket.broadcast.emit('player update', --numberOfConnections));
    });

    function startIntervals() {
        roundCheckInterval = setInterval(checkIfRoundIsClosed, 250);
        roundInterval = setInterval(closeRound, 10000);
    }

    function stopIntervals() {
        clearInterval(roundCheckInterval);
        clearInterval(roundInterval);
    }

    function checkIfRoundIsClosed() {
        if (roundIsClosed){
            stopIntervals();
            setTimeout(startRound, 5000);
        }
    }

    function startRound() {
        io.emit('question', createQuestion());
        roundIsClosed = false;
        startIntervals();
    }

    function closeRound() {
        roundIsClosed = true;
        io.emit('round closed', 'round closed');
    }
}

module.exports = {
    getRandomNumber,
    getRandomInt,
    getFakeAnswer,
    getRealAnswer,
    createQuestion,
    createConnection
};
