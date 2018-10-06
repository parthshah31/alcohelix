import React, { Component } from 'react';
import GraphComponent from './GraphComponent';
import WarningComponent from './WarningComponent';
import DrinkUpdateComponent from './DrinkUpdateComponent';

const DRINK_CHECKER_INTERVAL = 2000;

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {
        weight: 200.0,
        gender: 'M',
        food: 0.0,
        history: [Date.now()-20*60*1000, Date.now()-11*60*1000, Date.now()-10*60*1000, Date.now()-5*60*1000, Date.now()],
        schedule: [Date.now()+10*60*1000, Date.now()+20*60*1000, Date.now()+30*60*1000],
        goal: 0.08,
        alpha: 1
      }
    };
  }

  componentDidMount() {
    this.drinkCheckerInterval = setInterval(this.drinkChecker, DRINK_CHECKER_INTERVAL);
  }

  componentDidUnmount() {
    clearInterval(this.drinkCheckerInterval);
  }

  drinkChecker = () => {
    // CODE THAT UPDATES STATE EVERY DRINK_CHECKER_INTERVAL SECONDS
  }
  
  render() {
    return (
      <div>
        <h1>Alcohelix</h1>
        <GraphComponent user={this.state.user} />
        <WarningComponent user={this.state.user} />
        <DrinkUpdateComponent user={this.state.user} />
      </div>
    );
  }
}

export default App;
