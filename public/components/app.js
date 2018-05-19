import React, { Component, Fragment } from 'react';
import Status from './status';
import Card from './card';
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

    componentDidMount(){ initialize(this); }
    
    render(){
        return (
            <Fragment>
                <Status numberOfPlayers={ this.state.numberOfPlayers } score={ this.state.score } />
                <Card text={ this.state.text } time={ this.state.time } />
            </Fragment>
        );
    }
}

export default App;