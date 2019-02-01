import React, { Component } from 'react';
import Button from "@material-ui/core/Button";
import moment from 'moment';

export default class DrinkUpdateComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      curTime: moment().unix()
    };

    this.updateCurTime = e => {
      this.setState({curTime: moment().unix()});
    }
  }

  componentDidMount() {
    this.clockInterval = setInterval(
      this.updateCurTime,
      1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.clockInterval);
  }


  render() {
    let warningText = "";
    if (!this.props.active || this.props.schedule.length === 0) {
      warningText = "Schedule paused. Hit start to begin!"
    } else if (this.state.curTime < this.props.schedule[0]) {
      let secRemain = (this.props.schedule[0] - this.state.curTime);
      let minRemain = Math.floor(secRemain/60);
      let hourRemain = Math.floor(secRemain/3600);
      secRemain = secRemain % 60;
      minRemain = minRemain % 60;
      if (secRemain < 10) {
        secRemain = "0" + secRemain
      }
      if (minRemain < 10) {
        minRemain = "0" + minRemain
      }
      warningText = `${hourRemain} : ${minRemain} : ${secRemain}`
    } else {
      warningText = "NOW!!!"
    }


    let drinkButton = (
      <Button variant="contained" className="drink-button" onClick={this.props.addDrink}>
        <p className="bold-text margin-zero">Add Drink</p>
        <img className="drink-img" src={require('./assets/drink.svg')}/>
      </Button>
    );

    let scheduleButton = (
        <Button variant="contained" className="sched-button" onClick={this.props.active ? this.props.resetSchedule : this.props.resume}>
            <p className="bold-text margin-zero">{this.props.active ? 'stop' : 'start'}</p>
            <img className="clock-img" src={require('./assets/clock.svg')}/>
        </Button>
    )

    let timer = (
      <div className="timer">
        <p>Time until next drink: </p>
        <h2>{warningText}</h2>
      </div>
    );

    return (
      <div className="drink-container">
      {drinkButton} {scheduleButton}<br></br>
      {this.props.active ? timer : (<div></div>)}
      </div>
    );

  }
};
