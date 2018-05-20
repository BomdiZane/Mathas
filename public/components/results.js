import React from 'react';
import PropTypes from 'prop-types';
import Head from './head';
import Card from './card';
import StateCard from './stateCard';
import Buttons from './buttons';

const Results = ({ states }) => {
    return (
        <div id='results'>
            <Head body={ states.head } />
            <Card body={ <StateCard states={ states.content }  /> } />
        </div>
    );
};

Results.propTypes = {
    states: PropTypes.object.isRequired,
};

export default Results;