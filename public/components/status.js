import React from 'react';
import PropTypes from 'prop-types';

const Status = ({ numberOfPlayers, score }) => {
    return (
        <div>
            <span id="numPlayers">Players: { numberOfPlayers }</span>
            <span id="score">Score: { score }</span>
        </div>
    );
};

Status.propTypes = {
    numberOfPlayers: PropTypes.number.isRequired,
    score: PropTypes.number.isRequired
};

export default Status;