import React from 'react';
import PropTypes from 'prop-types';
import Head from './head';
import Card from './card';
import Game from './game';
import Status from './status';
import Buttons from './buttons';

const Main = ({ states }) => {
    return (
        <div id='main'>
            <Head body={ <Status states={ states.status }  /> } />
            <Card body={ <Game states={ states.game } /> } />
            <Buttons />
        </div>
    );
};

Main.propTypes = {
    states: PropTypes.object.isRequired,
};

export default Main;