import React from 'react';
import PropTypes from 'prop-types';
import Head from './head';
import Card from './card';
import List from './list';

const Rules = ({ states }) => {
    return (
        <div id='rules'>
            <Head body={ states.head } />
            <Card body={ <List states={ states.content }  /> } />
        </div>
    );
};

Rules.propTypes = {
    states: PropTypes.object.isRequired,
};

export default Rules;
