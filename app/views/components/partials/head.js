import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Head extends Component{
	constructor(props){
		super(props);
	}

	render(){
		return (<div className="title">{ this.props.children }</div>);
	}
}

Head.propTypes = {
	children: PropTypes.node.isRequired,
};

export default Head;