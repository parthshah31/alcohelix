import React, { Component } from 'react';

export default class WarningComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      curTime: Date.now()
    };

    this.updateTimeAndCheckTimeout = e => {
      this.setState({curTime: Date.now()});
      if (this.props.schedule.length < 2 || this.state.curTime > this.props.schedule[1]) {
        this.props.resetSchedule();
      }
    }
  }

  componentDidMount() {
    this.clockInterval = setInterval(
      this.updateTimeAndCheckTimeout,
      1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.clockInterval);
  }

  render() {
    let warningText = "";
    if (this.props.schedule.length < 2) {
      warningText = "Schedule Ended. Take a drink to continue!"
    } else if (this.state.curTime < this.props.schedule[0]) {
      let secRemain = (this.props.schedule[0] - this.state.curTime)/1000;
      let minRemain = Math.floor(secRemain/60);
      secRemain = Math.ceil(secRemain % 60);
      if (secRemain < 10) {
        secRemain = "0" + secRemain
      }
      warningText = `Time until next shot: ${minRemain}:${secRemain}`
    } else {
      warningText = "Drink NOW!!!"
    }

    return (
      <div>
        <h2>warning component</h2>
        <h5>{warningText}</h5>
      </div>
    );
  }
};
