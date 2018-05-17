import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Card extends Component{
    constructor(props){
        super(props);
        this.state = {
            text: 'Wait for next round...',
            time: 5
        };
    }
    
    render(){
        return (
            <div id="questionCard">
                <p id="textPad">{this.state.text}</p>
                <span id="timer">{this.state.time}</span>
                <div id="buttonHolder">
                    <button id="yesButton">Yes</button>
                    <button id="noButton">No</button>
                </div>
            </div>
        );
    }
}

export default Card;