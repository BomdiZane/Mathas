const options = {
    operators : ['+', '-', '*', '/'],
    minValue : 1,
    maxValue : 10
};

let result;

function getRandomNumber(max, min = 0) {
    if (!max || typeof(max) !== 'number' || typeof(min) !== 'number') return 0;
    return Math.random() * (max - min + 1) + min;
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
    switch(operator){
        case '+': answer = getRandomNumber(options.maxValue * 2, options.minValue * 2); break;
        case '-': answer = getRandomNumber(options.maxValue - options.minValue); break;
        case '*': answer = getRandomNumber(Math.pow(options.maxValue, 2), Math.pow(options.minValue, 2)); break;
        case '/': answer = getRandomNumber(options.maxValue / options.minValue, options.minValue / options.maxValue); break;
        default: console.log('Invalid operator');
    }

    result = 'no';
    return answer;
}

function getRealAnswer(operand1, operand2, operator) {
    let answer;

    switch(operator){
        case '+': answer = operand1 + operand2; break;
        case '-': answer = operand1 - operand2; break;
        case '*': answer = operand1 * operand2; break;
        case '/': answer = operand1 / operand2; break;
        default: console.log('Invalid operator');
    }

    result = 'yes';
    return answer;
}

function createQuestion() {

    let operand1 = getRandomNumber(options.maxValue, options.minValue),
        operand2 = getRandomNumber(options.maxValue, options.minValue),
        operator = options.operators[getRandomInt(options.operators.length)],
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
        messageInterval = setInterval(()=>{
            io.emit('question', createQuestion());
        }, 5000),
        numConnections = 0;
    
    io.on('connection', socket => {
        numConnections++;

        io.emit('player update', numConnections);
        
        socket.on('disconnect', () => {
            numConnections--;
            socket.broadcast.emit('player update', numConnections);
        });
    });
}

module.exports = createConnection;