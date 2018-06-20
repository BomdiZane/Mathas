import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

const StateCard = ({ states }) => {
    let cards = [],
        index = 0;
    states.forEach(state => {
        cards.push(
            <div key={ index++ } className={ `${ state.answer } resultCard` }>
                <span>Round: { state.round }</span>
                <span>{ state.answer }</span>
                <span>Score: { state.result }</span>
            </div>
        );
    });
    return cards;
};

StateCard.propTypes = {
    states: PropTypes.array.isRequired,
};

export default StateCard;