import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Status extends Component{
    constructor(props){
        super(props);
        this.state = {
            numberOfPlayers: 0,
            score: 0
        };
    }
    render(){
        return (
            <div>
                <span id="numPlayers">Players: {this.state.numberOfPlayers}</span>
                <span id="score">Score: {this.state.score}</span>
            </div>
        );
    }
}

export default Status;