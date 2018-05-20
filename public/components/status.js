import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

const Status = ({ states }) => {
    return (
        <Fragment>
            <span id="numPlayers">Players: { states.numberOfPlayers }</span>
            <span id="score">Score: { states.score }</span>
        </Fragment>
    );
};

Status.propTypes = {
    states: PropTypes.object.isRequired,
};

export default Status;