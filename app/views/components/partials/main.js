import React from 'react';
import PropTypes from 'prop-types';
import Head from './head';
import Card from './card';

const Main = ({ states, handleAnswer, buttonDisplay }) => {
	return (
		<div id='main'>
			<Head>
				<span id="numPlayers">Players: { states.status.numberOfPlayers }</span>
				<span id="score">Score: { states.status.score }</span>
			</Head>

			<Card>
				<p id="textPad">{ states.game.text }</p>
				<span id="timer">{ states.game.time }</span>
			</Card>

			<div id="buttonHolder" style={{ display: buttonDisplay }}>
				<button id="yesButton" onClick={ () => handleAnswer('yes') }>Yes</button>
				<button id="noButton" onClick={ () => handleAnswer('no') }>No</button>
			</div>
		</div>
	);
};

Main.propTypes = {
	states: PropTypes.object.isRequired,
	handleAnswer: PropTypes.func.isRequired,
	buttonDisplay: PropTypes.string.isRequired,
};

export default Main;