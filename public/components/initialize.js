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
		roundInterval;

	socket.on('connection', utils.success('Welcome'));
	socket.on('question', payload => handleQuestion(payload));
	socket.on('round closed', payload => handleRoundClosed(payload));
	socket.on('player update', payload => self.setState({ numberOfPlayers: payload }));
	
	// Update UI with new question
	function handleQuestion(payload)
	{
		let count = 10; // Each round last for 10 seconds

		clearInterval(waitInterval);
		roundClosed = false;
		correctAnswer = false;
		currentResult = payload.result;
		self.setState({ time: count-- });

		// Show a countdown of the game time (10s)
		roundInterval = setInterval(() => {
			if (count === 0) return clearInterval(roundInterval);
			self.setState({	time: count-- });
		}, 1000);

		// Display the question and response buttons
		self.setState({
			text: `${payload.operand1} ${payload.operator}  ${payload.operand2} = ${payload.answer}`
		});
		I('buttonHolder').style.display = 'flex';
	}
	
	// Update UI when round ends
	function handleRoundClosed(payload)
	{
		if (correctAnswer) utils.success('correct :)');
		else utils.warn('Round closed!');
		waitForNextRound();
	}

	// Handle players response
	function handleAnswer(answer)
	{
		// If the round has ended, notify the player and do nothing else
		if (roundClosed) return utils.warn('This round is closed!');

		let newScore;
			
		// Update player's score on UI base on his/her response
		if (answer === currentResult){
			newScore = ++self.state.score;
			// If player's response is correct, notify the server so that
			// next round can begin
			socket.emit('answer', answer);
			correctAnswer = true;
		}
		else{
			newScore = self.state.score > 0 ? --self.state.score : 0;
			utils.failure('wrong :(');
			resetView('Wait for next round...');
		}

		self.setState({ time: newScore });
	}

	function waitForNextRound() {
		let count = 5; // Delay of 5 seconds between rounds

		clearInterval(roundInterval);
		roundClosed = true;
		self.setState({ time: count-- });
		resetView('Next round starts in');

		waitInterval = setInterval(() => {
			if (count === 0) return clearInterval(waitInterval);
			self.setState({	time: count-- });
		}, 1000);
	}

	function resetView(message) {
		self.setState({ text: message });
		I('buttonHolder').style.display = 'none';
	}
	
	return {
		handleAnswer
	};
}

export default initialize;