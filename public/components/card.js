import React from 'react';
import PropTypes from 'prop-types';

const Card = ({ text, time }) => {
    return (
        <div id="questionCard">
            <p id="textPad">{ text }</p>
            <span id="timer">{ time }</span>
            <div id="buttonHolder">
                <button id="yesButton">Yes</button>
                <button id="noButton">No</button>
            </div>
        </div>
    );
};

Card.propTypes = {
    text: PropTypes.string.isRequired,
    time: PropTypes.number.isRequired
};

export default Card;