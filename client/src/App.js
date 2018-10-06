import React, { Component } from 'react';
import GraphComponent from './GraphComponent';
import WarningComponent from './WarningComponent';
import DrinkUpdateComponent from './DrinkUpdateComponent';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      weight: 200.0,
      gender: 'M',
      food: 0.0,
      history: [],
      schedule: [],
      active: false,
      goal: 0.08,
      alpha: 1
    };

    this.addDrink = () => {
      let newHistory = this.state.history
      newHistory.push(Date.now());
      this.setState({
        history: newHistory
      });
      this.calcSchedule();
    };

    this.resume = () => {
      this.setState({active: true});
      this.calcSchedule();
    }

    this.pause = () => {
      this.setState({active: false});
    }

    this.calcSchedule = () => {
      let newSchedule = [Date.now()+1*10*1000, Date.now()+1*20*1000, Date.now()+1*30*1000];
      this.setState({
        schedule: newSchedule
      });
    };

    this.clearSchedule = () => {
      this.setState({schedule: []});
    };

    this.reset = () => {
      this.pause();
      this.clearSchedule();
    }
  }


  componentDidMount() {
    this.calcSchedule();
  }

  componentWillUnmount() {}
  
  render() {
    return (
      <div>
        <h1>Alcohelix</h1>
        <button onClick={this.calcSchedule}>Calculate Schedule</button><br></br>

        <h2>State: {this.state.active ? "Active" : "Paused"}</h2>
        <h2>History</h2>
        <ul>
          {this.state.history.map(function(ts, ix) {
            var date = new Date(ts);
            return <li key={ix}>{date.toLocaleTimeString('en-US')}</li>;
          })}
        </ul>

        <h2>Scheduled Drinks</h2>
        <ul>
          {this.state.schedule.map(function(ts, ix) {
            var date = new Date(ts);
            return <li key={ix}>{date.toLocaleTimeString('en-US')}</li>;
          })}
        </ul>

        <GraphComponent />
        <WarningComponent
          active={this.state.active}
          schedule={this.state.schedule}
        />
        <DrinkUpdateComponent
          active={this.state.active}
          addDrink={this.addDrink}
          resume={this.resume}
          reset={this.reset}
        />
      </div>
    );
  }
}

export default App;
