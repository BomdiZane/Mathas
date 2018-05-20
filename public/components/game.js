import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

const Game = ({ states }) => {
    return (
        <Fragment>
            <p id="textPad">{ states.text }</p>
            <span id="timer">{ states.time }</span>
        </Fragment>
    );
};

Game.propTypes = {
    states: PropTypes.object.isRequired,
};

export default Game;