import  '../../sass/error.scss';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Utils, { Q } from '../../utils/clientSideUtils';
import SocialIcons from './partials/socialIcons';

class Error extends Component{
	constructor(props){
		super(props);
	}

	componentDidMount(){

		this.utils = new Utils();

		window.addEventListener('click', event => {
			let element = event.target;

			if (element.classList.contains('language')) this.utils.translatePage(element);
			else if (element.id === 'scrollToTop') Q('header').scrollIntoView({
				behavior:'smooth',
				block: 'start'
			});
		});

		Q('#copy').appendChild(document.createTextNode(' - '+new Date().getFullYear()));
	}
    
	render(){
		return <SocialIcons />;
	}
}

ReactDOM.render(<Error />, Q('section'));
