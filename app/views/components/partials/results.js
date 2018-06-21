import React from 'react';
import PropTypes from 'prop-types';
import Head from './head';
import Card from './card';

const Results = ({ states }) => {
	let cards = [],
		index = 0;
        
	states.content.forEach(item => cards.push(
		<div key={ index++ } className={ `${ item.answer } resultCard` }>
			<span>Round: { item.round }</span>
			<span>{ item.answer }</span>
			<span>Score: { item.result }</span>
		</div>
	));

	return (
		<div id='results'>
			<Head>{ states.head }</Head>
			<Card>{ cards }</Card>
		</div>
	);
};

Results.propTypes = {
	states: PropTypes.object.isRequired,
};

export default Results;