import React, { Component } from 'react';
import GraphComponent from './GraphComponent';
import WarningComponent from './WarningComponent';
import DrinkUpdateComponent from './DrinkUpdateComponent';
import Button from "@material-ui/core/Button";
import Slider from '@material-ui/lab/Slider';

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

    this.handleGoalChange = (event, value) => {
      this.setState({ goal: value });
    };

    this.handleAlphaChange = (event, value) => {
      this.setState({ alpha: value/100 });
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
      <div className="view">
        <div className="logo-container">
          <img className="logo" alt="logo" src={require('./assets/title.png')}/>
        </div>

        <div className="expand-container">
        <Button className="mdc-button" onClick={this.toggleScheduleView}>
          <p className="button-text">{ this.state.expanded ? "hide schedule" : "show schedule" }</p>
          <img className={ this.state.expanded ? "arrow arrow-up" : "arrow"} src={require('./assets/arrows.svg')}/>
        </Button>
        </div>

        <div className={this.state.expanded?"sched-expanded":"sched-closed"}>
          <div className="sched-button-container">
            <Button className="sched-button"
              onClick={this.calcSchedule}>
              <p className="button-text">calculate schedule</p>
            </Button>
          </div>
          <p>
            <strong>State:</strong>
            {this.state.active ? " Getting Lit!!" : " Sobering Up"}
          </p>
          <p><strong>History</strong></p>
          <div className="timelist">
            {this.state.history.map(function(ts, ix) {
              var date = new Date(ts);
              return <li key={ix}>{date.toLocaleTimeString('en-US')}</li>;
            })}
          </div>

          <p><strong>Scheduled Drinks</strong></p>
          <div className="timelist">
            {this.state.schedule.map(function(ts, ix) {
              var date = new Date(ts);
              return <li key={ix}>{date.toLocaleTimeString('en-US')}</li>;
            })}
          </div>

          <p><strong>Goal BAC:</strong> {this.state.goal}</p>
          <Slider value={this.state.goal} min={0} max={0.2} step={0.02} aria-labelledby="label" onChange={this.handleGoalChange}/>
          
          <p><strong>Alpha:</strong> {this.state.alpha}</p>
          <Slider value={this.state.alpha*100} aria-labelledby="label" onChange={this.handleAlphaChange}/>
        </div>

        <DrinkUpdateComponent
          active={this.state.active}
          addDrink={this.addDrink}
          resume={this.resume}
          reset={this.reset}
        />

        <GraphComponent />
        <WarningComponent
          active={this.state.active}
          schedule={this.state.schedule}
        />
      </div>
    );
  }
}

export default App;
