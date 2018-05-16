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
	
	// Other Listeners

	// Set Default States/Values
	I('copy').appendChild(document.createTextNode(' - '+new Date().getFullYear()));
	
}

function SocketIO() {
	'use strict';

	if (!this || !(this instanceof SocketIO)) return new SocketIO();

	let socket = io(),
		utils = new Utils(),
		currentResult;

	socket.on('connection', utils.success('Welcome'));
	socket.on('question', payload => handleQuestion(payload));
	socket.on('player update', payload => I('numPlayers').textContent = `Players: ${payload}`);
	
	function handleQuestion(payload)
	{
		currentResult = payload.result;

		I('textPad').textContent = `${payload.operand1} ${payload.operand2}  ${payload.operator} = ${payload.answer}`;
		I('questionCard').lastChild.style.display = 'flex';
	}

	function handleAnswer(answer)
	{
		let oldScore = Number(I('score').textContent.split(':')[1].trim()),
			newScore;
		
		if (answer === currentResult){
			newScore = oldScore++;
			success('correct :)');
		}
		else{
			newScore = oldScore--;
			failure('wrong :(');
		}

		I('questionCard').lastChild.style.display = 'none';
		I('score').textContent = `Score: ${newScore}`;
		I('textPad').textContent = 'Wait for next round...';
	}
	
	return {
		handleAnswer
	};
}

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
