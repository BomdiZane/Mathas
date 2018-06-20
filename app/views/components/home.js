import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import { Q } from '../../utils/clientSideUtils';
import Rules from './partials/rules';
import Main from './partials/main';
import Results from './partials/results';
import initialize from './partials/initialize';

class App extends Component{
	constructor(props){
		super(props);
		let rules = [
			'Each round lasts for 10 seconds',
			'You can either answer Yes or No to the question. You get 1 point for correct answers and loose 1 point for wrong answers. However, you cannot have less than zero points',
			'Only the first player to give the correct answer gets the point',
			'The round ends when a correct response is received or when the 10 seconds elapse',
			'The next round starts 5 seconds after the end of the previous round'
		];        
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
				content: rules
			},
			results: {
				head: 'Results',
				content: []
			}
		};
	}

	componentDidMount(){ initialize(this); }
    
	render(){
		return (
			<Fragment>
				<Rules states={ this.state.rules } />
				<Main states={ this.state.main } />
				<Results states={ this.state.results } />
			</Fragment>
		);
	}
}

ReactDOM.render(<App />, Q('section'));
