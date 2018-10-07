import React, { Component } from 'react';
import GraphComponent from './GraphComponent';
import WarningComponent from './WarningComponent';
import DrinkUpdateComponent from './DrinkUpdateComponent';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      expanded: false,
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

    this.toggleScheduleView = () => {
      this.setState({expanded: !this.state.expanded})
    }

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
        <div className="logo-container">
          <img className="logo" alt="logo" src={require('./assets/title.png')}/>
        </div>

        <button onClick={this.toggleScheduleView}>
          { this.state.expanded ? "hide schedule" : "show schedule" }
        </button>

        <div className={this.state.expanded?"sched-expanded":"sched-closed"}>
          <button onClick={this.calcSchedule}>calculate schedule</button>
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
        </div>

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
