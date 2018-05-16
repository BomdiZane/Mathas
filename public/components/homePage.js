import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

const App = () => {
    return (
        <div>
            <span id="numPlayers">Players: {props.numberOfPlayers}</span>
            <span id="score">Score: {props.score}</span>
        </div>
    );
};

App.propTypes = {
    numberOfPlayers: React.PropTypes.number.isRequired,
    score: React.PropTypes.number.isRequired
};

ReactDOM.render(
    <App numberOfPlayers='0' score='0'/>,
    I('mainSection')
);
