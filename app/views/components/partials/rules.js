import React from 'react';
import PropTypes from 'prop-types';
import Head from './head';
import Card from './card';

const Rules = ({ states }) => {
	let items = [],
		index = 0;

	states.content.forEach(item => items.push(<li key={ index++ }>{ item }</li>));

	return (
		<div id='rules'>
			<Head>{ states.head }</Head>
			<Card>{ <ol>{ items }</ol> }</Card>
		</div>
	);
};

Rules.propTypes = {
	states: PropTypes.object.isRequired,
};

export default Rules;
