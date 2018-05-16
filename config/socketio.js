const options = {
    operators : ['+', '-', '*', '/'],
    minValue : 1,
    maxValue : 10
};

let result; // Are we expecting a 'yes' or 'no' answer? Per round. 

function getRandomNumber(max, min = 0) {
    if (!max || typeof(max) !== 'number' || typeof(min) !== 'number') return 0;
    return Number((Math.random() * (max - min + 1) + min).toFixed(2));
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
        case '+':
            answer = getRandomNumber(options.maxValue * 2, options.minValue * 2);
            break;
        case '-':
            answer = getRandomNumber(options.maxValue - options.minValue);
            break;
        case '*':
            answer = getRandomNumber(Math.pow(options.maxValue, 2), Math.pow(options.minValue, 2));
            break;
        case '/':
            answer = getRandomNumber(options.maxValue / options.minValue, options.minValue / options.maxValue);
            break;
        default: console.log('Invalid operator fake: '+ operator);
    }

    result = 'no'; // Here we send the wrong answer so the correct response should be 'no'
    return answer;
}

function getRealAnswer(operand1, operand2, operator) {
    let answer;

    switch(operator){
        case '+': answer = operand1 + operand2; break;
        case '-': answer = operand1 - operand2; break;
        case '*': answer = operand1 * operand2; break;
        case '/': answer = operand1 / operand2; break;
        default: console.log('Invalid operator: '+ operator);
    }

    result = 'yes'; // Here we send the correct answer so the correct response should be 'yes'
    return answer.toFixed(2);
}

function createQuestion() {
    // Generate a random question and answer
    let operand1 = getRandomNumber(options.maxValue, options.minValue),
        operand2 = getRandomNumber(options.maxValue, options.minValue),
        operator = options.operators[getRandomInt(options.operators.length-1)],
        coin = getRandomInt(10),
        answer = coin > 5 ? getRealAnswer(operand1, operand2, operator) : getFakeAnswer(operator);

    return {
        operand1,
        operand2,
        operator,
        answer,
        result
    };
}

function createConnection(http) {

    let io = require('socket.io')(http),
        roundClosed = true, 
        checkInterval,
        roundInterval,
        numberOfConnections = 0;
    
    startIntervals();

    io.on('connection', socket => {
        numberOfConnections++;
        // We let each user know how many players are currently participating
        io.emit('player update', numberOfConnections);

        // Once we get a correct response from a player, we close the round
        // to reject futher responses and prepare to start the next round
        socket.on('answer', answer => {
            if (!roundClosed) closeRound();
        });
        
        // When a player leaves we notify the rest of the current number of
        // participants
        socket.on('disconnect', () => {
            numberOfConnections--;
            socket.broadcast.emit('player update', numberOfConnections);
        });
    });
    
    // If the current round has been closed, start next round after 5 seconds
    function checkClosed() {
        if (roundClosed){
            stopIntervals();
            setTimeout(startRound, 5000);
        }
    }

    // Generate random question and start round
    function startRound() {
        io.emit('question', createQuestion());
        roundClosed = false;
        startIntervals();
    }

    // Close current round and notify players
    function closeRound() {
        roundClosed = true;
        io.emit('round closed', 'round closed');
    }

    // Start all intervals
    function startIntervals() {
        checkInterval = setInterval(checkClosed, 250);
        
        // If no correct response is received after 10 seconds, 
        // start a new round
        roundInterval = setInterval(closeRound, 10000);
    }

    // Stop all intervals
    function stopIntervals() {
        clearInterval(checkInterval);
        clearInterval(roundInterval);
    }
}

module.exports = createConnection;