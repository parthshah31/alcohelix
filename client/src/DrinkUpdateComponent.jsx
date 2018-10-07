import React, { Component } from 'react';
import Button from "@material-ui/core/Button";

export default class DrinkUpdateComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      curTime: Date.now()
    };

    this.updateCurTime = e => {
      this.setState({curTime: Date.now()});
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
      let secRemain = (this.props.schedule[0] - this.state.curTime)/1000;
      let minRemain = Math.floor(secRemain/60);
      secRemain = Math.ceil(secRemain % 60);
      if (secRemain < 10) {
        secRemain = "0" + secRemain
      }
      warningText = `${minRemain}:${secRemain}`
    } else {
      warningText = "NOW!!!"
    }

    if (!this.props.active) {
      return (
        <div className="drink-container">
          <h2>drink update</h2>
          <Button className="sched-button" onClick={this.props.resume}>
              <p className="button-text">start drinking!</p>
          </Button>
        </div>
      );
    } else {
      return (
        <div className="drink-container">
          <h2>drink update</h2>
          <Button variant="contained" className="drink-button" onClick={this.props.addDrink}>
            <p className="bold-text margin-zero">Add Drink</p>
            <img className="drink-img" src={require('./assets/drink.svg')}/>
          </Button><br></br>
          <Button className="sched-button" onClick={this.props.reset}>
              <p className="button-text">sober up</p>
          </Button>
          <p>Time until next drink: </p>
          <div className="timer">
            <h2>{warningText}</h2>
          </div>
        </div>
      );
    }
  }
};
