import React, { Component } from 'react';

export default class WarningComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      curTime: Date.now()
    };

    this.updateTimeAndCheckTimeout = e => {
      this.setState({curTime: Date.now()});
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
    if (!this.props.active || this.props.schedule.length === 0) {
      warningText = "Schedule paused. Take a drink to continue!"
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
