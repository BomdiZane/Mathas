window.addEventListener('load', initialize);

function initialize() {
	'use strict';

    cleanDOM(document); //Removes all empty textNodes => Makes DOM navigation easy

	let citego = new Router(),
		utils = new Utils(),
		sock = new SocketIO();

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

function SocketIO() {
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
	socket.on('player update', payload => I('numPlayers').textContent = `Players: ${payload}`);
	
	// Update UI with new question
	function handleQuestion(payload)
	{
		let count = 10; // Each round last for 10 seconds

		clearInterval(waitInterval);
		roundClosed = false;
		correctAnswer = false;
		currentResult = payload.result;
		I('timer').textContent = count--;

		// Show a countdown of the game time (10s)
		roundInterval = setInterval(() => {
			if (count === 0) return clearInterval(roundInterval);
			I('timer').textContent = count--;
		}, 1000);

		// Display the question and response buttons
		I('textPad').textContent = `${payload.operand1} ${payload.operator}  ${payload.operand2} = ${payload.answer}`;
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

		let oldScore = Number(I('score').textContent.split(':')[1].trim()),
			newScore;
			
		// Update player's score on UI base on his/her response
		if (answer === currentResult){
			newScore = ++oldScore;
			// If player's response is correct, notify the server so that
			// next round can begin
			socket.emit('answer', answer);
			correctAnswer = true;
		}
		else{
			newScore = oldScore > 0 ? --oldScore : 0;
			utils.failure('wrong :(');
			resetView();
		}

		I('score').textContent = `Score: ${newScore}`;
	}

	function waitForNextRound() {
		let count = 5; // Delay of 5 seconds between rounds

		clearInterval(roundInterval);
		roundClosed = true;
		I('timer').textContent = count--;
		resetView();

		waitInterval = setInterval(() => {
			if (count === 0) return clearInterval(waitInterval);
			I('timer').textContent = count--;
		}, 1000);
	}

	function resetView() {
		I('textPad').textContent = 'Wait for next round...';
		I('buttonHolder').style.display = 'none';
	}
	
	return {
		handleAnswer
	};
}

// For normal http routing
// Just part of my boilerplate (NOT needed for this task)
function Router() {
	'use strict';

    if (!this || !(this instanceof Router)) return new Router();
	
	let utils = new Utils();

	window.addEventListener('click', event => {
		let element = event.target;

		
	});

	function getData(url, handle)
	{
		viewPopUp('waitDiv');

		fetch(url)
		.then(response => {
			if (response.ok) return response.json();
			throw new Error('getData response was not ok!');
		})
		.then(data => {
			if (data.error) utils.failure(data.error);
			else handle(data);
		})
		.catch(e => utils.failure(e))
		.finally(() => closePopUp());
	}

	function postData(url, data, handle)
	{
		let options = {
				method: 'POST',
				body: JSON.stringify(data),
				headers: new Headers({
					'Content-Type': 'application/json'
				  })
			};

		viewPopUp('waitDiv');

		fetch(url, options)
		.then(response => {
			if (response.ok) return response.json();
			throw new Error('postData response was not ok!');
		})
		.then(results => {
			if (results.error) utils.failure(results.error);
			else handle(results);
		})
		.catch(e => utils.failure(e))
		.finally(() => closePopUp());
	}
    
	function viewPopUp(section) {
		let popUps = I('popUpDiv').childNodes;

		I('blurDiv').style.display = 'flex';
		I('popUpDiv').style.display = 'flex';

		for(let i = 0, len = popUps.length; i < len; i++){ popUps[i].style.display = 'none'; }
		I(section).style.display = 'flex';
	}
	
	function closePopUp () {
		I('blurDiv').style.display = 'none';
		I('popUpDiv').style.display = 'none';
	}

	return{
		
	};
}
