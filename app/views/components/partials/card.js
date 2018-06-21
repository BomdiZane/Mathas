import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Card extends Component{
	constructor(props){
		super(props);
	}

	render(){
		return (<div className='content'>{ this.props.children }</div>);
	}
}

Card.propTypes = {
	children: PropTypes.node.isRequired,
};

export default Card;