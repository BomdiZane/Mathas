import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import initialize from './initialize';

class App extends Component{
    constructor(props){
        super(props);
        this.state = {
            numberOfPlayers: 0,
            score: 0,
            text: 'Wait for next round...',
            time: 5
        };
    }

    componentDidMount(){
        initialize(this);
    }
    
    render(){
        return (
            <Fragment>
                <div>
                    <span id="numPlayers">Players: {this.state.numberOfPlayers}</span>
                    <span id="score">Score: {this.state.score}</span>
                </div>
                <div id="questionCard">
                    <p id="textPad">{this.state.text}</p>
                    <span id="timer">{this.state.time}</span>
                    <div id="buttonHolder">
                        <button id="yesButton">Yes</button>
                        <button id="noButton">No</button>
                    </div>
                </div>
            </Fragment>
        );
    }
}

export default App;