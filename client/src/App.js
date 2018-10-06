import React, { Component } from 'react';
import GraphComponent from './GraphComponent';
import WarningComponent from './WarningComponent';
import DrinkUpdateComponent from './DrinkUpdateComponent';

const DRINK_CHECKER_INTERVAL = 2000;

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      weight: 200.0,
      gender: 'M',
      food: 0.0,
      history: [],
      schedule: [],
      goal: 0.08,
      alpha: 1
    };

    this.addDrink = () => {
      let newHistory = this.state.history
      newHistory.push(Date.now());
      this.setState({
        active: true,
        history: newHistory
      });
      this.calcSchedule();
    };

    this.calcSchedule = () => {
      let newSchedule = [Date.now()+1*10*1000, Date.now()+1*20*1000, Date.now()+1*30*1000];
      this.setState({
        schedule: newSchedule
      });
    };

    this.resetSchedule = () => {
      this.setState({schedule: []});
    };
  }


  componentDidMount() {}

  componentWillUnmount() {}
  
  render() {
    return (
      <div>
        <h1>Alcohelix</h1>

        <h2>State: {this.state.schedule.length > 0 ? "Active" : "Paused"}</h2>
        <h2>History</h2>
        <ul>
          {this.state.history.map(function(ts) {
            var date = new Date(ts);
            return <li>{date.toLocaleTimeString('en-US')}</li>;
          })}
        </ul>

        <h2>Scheduled Drinks</h2>
        <ul>
          {this.state.schedule.map(function(ts) {
            var date = new Date(ts);
            return <li>{date.toLocaleTimeString('en-US')}</li>;
          })}
        </ul>

        <GraphComponent />
        <WarningComponent
          active={this.state.active}
          schedule={this.state.schedule}
          resetSchedule={this.resetSchedule}
        />
        <DrinkUpdateComponent
          addDrink={this.addDrink}
        />
      </div>
    );
  }
}

export default App;
