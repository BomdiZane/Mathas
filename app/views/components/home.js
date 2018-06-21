import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import  '../../sass/home.scss';
import Utils, { Q } from '../../utils/clientSideUtils';
import update from 'immutability-helper';

import SocialIcons from './partials/socialIcons';
import Rules from './partials/rules';
import Main from './partials/main';
import Results from './partials/results';

class Home extends Component{
	constructor(props){
		super(props);
		this.state = {
			main: {
				status: {
					numberOfPlayers: 0,
					score: 0,
				},
				game: {
					text: 'Wait for next round...',
					time: 5,
				},
			},
			rules: {
				head: 'Rules',
				content: [
					'Each round lasts for 10 seconds',
					'You can either answer Yes or No to the question. You get 1 point for correct answers and loose 1 point for wrong answers. However, you cannot have less than zero points',
					'Only the first player to give the correct answer gets the point',
					'The round ends when a correct response is received or when the 10 seconds elapse',
					'The next round starts 5 seconds after the end of the previous round'
				]
			},
			results: {
				head: 'Results',
				content: []
			},
			buttonDisplay: 'none'
		};
		this.handleAnswer = this.handleAnswer.bind(this);
		this.currentResult = null;
		this.correctAnswer = false;
		this.roundClosed = false;
		this.waitInterval = null;
		this.roundInterval = null;
		this.round = 0;
		/*global io */
		this.socket = io();
	}

	componentDidMount(){

		this.utils = new Utils();

		this.socket.on('connection', this.utils.success('Welcome'));
		this.socket.on('question', payload => this.handleQuestion(payload));
		this.socket.on('round closed', payload => {
			if (!this.correctAnswer) this.utils.warn('Round closed!');
			this.waitForNextRound();
		});
		this.socket.on('player update',
			payload => this.setState(prevState => update(prevState, { main: {status: {numberOfPlayers: {$set: payload}}}})));
		this.socket.on('answer accepted', payload => {
			this.waitForNextRound();
			if (payload === 'true') {
				let resultState = {
					round : this.round,
					answer : 'correct',
					result : '+1',
				};

				this.setState(prevState => update(prevState, {
					main: {status: {score: {$apply: x => x + 1 }}},
					results: {content: {$push: [resultState] }}
				}));
			}
			else this.utils.success('too late :)');
		});

		window.addEventListener('click', event => {
			let element = event.target;

			if (element.id === 'scrollToTop') Q('header').scrollIntoView({
				behavior:'smooth',
				block: 'start'
			});
			else if(element.id === 'subscribeButton') this.utils.failure('@TODO');
			else if(element.id === 'mainGoogleLogIn') this.utils.failure('@TODO');
			else if(element.id === 'mainFacebookLogIn') this.utils.failure('@TODO');
		});

		Q('#copy').appendChild(document.createTextNode(' - '+new Date().getFullYear()));
	}

	handleQuestion(payload)
	{
		let roundPeriod = 10;

		this.round++;
		clearInterval(this.waitInterval);
		this.roundClosed = false;
		this.correctAnswer = false;
		this.currentResult = payload.expectedResponse;
		this.setState(prevState => update(prevState, {	main: {game: {time: {$set: roundPeriod-- }}}}));

		// Show a countdown of the game time (10s)
		this.roundInterval = setInterval(() => {
			if (roundPeriod === 0) return clearInterval(this.roundInterval);
			this.setState(prevState => update(prevState, {	main: {game: {time: {$set: roundPeriod-- }}}}));
		}, 1000);

		// Display the question and response buttons
		this.setState(prevState => update(prevState, {
			main: {game: {text: {$set: `${payload.operand1} ${payload.operator}  ${payload.operand2} = ${payload.answer}` }}},
			buttonDisplay: {$set: 'flex' }
		}));
	}

	handleAnswer(answer)
	{
		if (this.roundClosed) return this.utils.warn('This round is closed!');

		if (answer === this.currentResult){
			this.socket.emit('answer', answer);
			this.correctAnswer = true;
		}
		else{
			let resultState = {
				round : this.round,
				answer : 'wrong',
				result : '-1',
			};

			if (this.state.main.status.score > 0) // The player's score should not be less than zero
				this.setState(prevState => update(prevState, { main: {status: {score: {$apply: x => x - 1 }}}}));

			this.setState(prevState => update(prevState, {
				results: {content: {$push: [resultState] }},
				main: {game: {text: {$set: 'Wait for next round...' }}},
				buttonDisplay: {$set: 'none' }
			}));
		}
	}

	waitForNextRound() {
		let delayBetweenRounds = 5;

		clearInterval(this.roundInterval);
		this.roundClosed = true;
		this.setState(prevState => update(prevState, {
			main: {game: {
				time: {$set: delayBetweenRounds-- },
				text: {$set: 'Next round starts in' }
			}},
			buttonDisplay: {$set: 'none' }
		}));

		this.waitInterval = setInterval(() => {
			if (delayBetweenRounds === 0) return clearInterval(this.waitInterval);
			this.setState(prevState => update(prevState, {	main: {game: {time: {$set: delayBetweenRounds-- }}}}));
		}, 1000);
	}
    
	render(){
		return (
			<Fragment>
				<Rules states={ this.state.rules } />
				<Main states={ this.state.main } handleAnswer={ this.handleAnswer } buttonDisplay={ this.state.buttonDisplay } />
				<Results states={ this.state.results } />
				<SocialIcons />
			</Fragment>
		);
	}
}

ReactDOM.render(<Home />, Q('section'));
