import Utils, { I, T, C, N, Q, A } from '../lib/utils.js';
import update from 'immutability-helper';

function initialize(self) {
	'use strict';

	let utils = new Utils(),
		sock = new SocketIO(self);

	// Window Click Listeners
	window.addEventListener('click', event => {
		let element = event.target;
		
		if (element.id === 'scrollToTop') Q('header').scrollIntoView({
			behavior:'smooth',
			block: 'start'
		});
		else if(element.id === 'yesButton') sock.handleAnswer('yes');
		else if(element.id === 'noButton') sock.handleAnswer('no');
		else if(element.id === 'subscribeButton') utils.failure('nope...not yet :)');
		else if(element.id === 'mainGoogleLogIn') utils.failure('nope...not yet :)');
		else if(element.id === 'mainFacebookLogIn') utils.failure('nope...not yet :)');
	});

	// Other Listeners
	[...A('.socialImage')].forEach(image => {
		image.addEventListener('mouseenter', event => event.target.style.willChange = 'transform');
		image.addEventListener('animationEnd', event => event.target.style.willChange = 'auto');
	});

	// Set Default States/Values
	I('copy').appendChild(document.createTextNode(' - '+new Date().getFullYear()));
	
}

function SocketIO(self) {
	'use strict';

	if (!this || !(this instanceof SocketIO)) return new SocketIO();

	let socket = io(),
		utils = new Utils(),
		currentResult,
		correctAnswer = false,
		roundClosed = false,
		waitInterval,
		roundInterval,
		round = 0;

	socket.on('connection', utils.success('Welcome'));
	socket.on('question', payload => handleQuestion(payload));
	socket.on('round closed', payload => handleRoundClosed(payload));
	socket.on('player update',
		payload => self.setState(update(self.state, { main: {status: {numberOfPlayers: {$set: payload}}}})
	));
	
	// Update UI with new question
	function handleQuestion(payload)
	{
		let count = 10; // Each round last for 10 seconds
		
		round++;
		clearInterval(waitInterval);
		roundClosed = false;
		correctAnswer = false;
		currentResult = payload.result;
		self.setState(update(self.state, {	main: {game: {time: {$set: count-- }}}}));

		// Show a countdown of the game time (10s)
		roundInterval = setInterval(() => {
			if (count === 0) return clearInterval(roundInterval);
			self.setState(update(self.state, {	main: {game: {time: {$set: count-- }}}}));
		}, 1000);

		// Display the question and response buttons
		self.setState(update(self.state, {	main: {game: {text: {$set: 
			`${payload.operand1} ${payload.operator}  ${payload.operand2} = ${payload.answer}` }}}}));
		I('buttonHolder').style.display = 'flex';
	}
	
	// Update UI when round ends
	function handleRoundClosed(payload)
	{
		if (!correctAnswer) utils.warn('Round closed!');
		waitForNextRound();
	}

	// Handle players response
	function handleAnswer(answer)
	{
		// If the round has ended, notify the player and do nothing else
		if (roundClosed) return utils.warn('This round is closed!');
			
		let resultState = { round: round };
		// Update player's score on UI base on his/her response
		if (answer === currentResult){
			self.setState(update(self.state, { main: {status: {score: {$apply: x => x + 1 }}}}));
			// If player's response is correct, notify the server so that
			// next round can begin
			socket.emit('answer', answer);
			correctAnswer = true;
			resultState.answer = 'correct';
			resultState.result = '+1';
		}
		else{
			// The player's score should not be less than zero
			if (self.state.main.status.score > 0) 
				self.setState(update(self.state, { main: {status: {score: {$apply: x => x - 1 }}}}));

			resetView('Wait for next round...');
			resultState.answer = 'wrong';
			resultState.result = '-1';
		}
		
		self.setState(update(self.state, { results: {content: {$push: [resultState] }}}));
	}

	function waitForNextRound() {
		let count = 5; // Delay of 5 seconds between rounds

		clearInterval(roundInterval);
		roundClosed = true;
		self.setState(update(self.state, {	main: {game: {time: {$set: count-- }}}}));
		resetView('Round starts in');

		waitInterval = setInterval(() => {
			if (count === 0) return clearInterval(waitInterval);
			self.setState(update(self.state, {	main: {game: {time: {$set: count-- }}}}));
		}, 1000);
	}

	function resetView(message) {
		self.setState(update(self.state, {	main: {game: {text: {$set: message }}}}));
		I('buttonHolder').style.display = 'none';
	}
	
	return {
		handleAnswer
	};
}

export default initialize;