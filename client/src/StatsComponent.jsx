import React, { Component } from 'react';
import moment from 'moment'

export default class StatsComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fastNow: moment().unix(),
    };

    this.updateFastNow = () => {
      this.setState({fastNow: moment().unix()});
    }

    this.getTimeText = (secRemain) => {
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
      if (hourRemain > 0) {
        return `${hourRemain}:${minRemain}:${secRemain}`;
      } else {
        return `${minRemain}:${secRemain}`;
      }
    }
  }

  componentDidMount() {
    this.fastClockInterval = setInterval(
      this.updateFastNow,
      1 * 1 * 1000
    );
  }

  render() {
    let currentBacText = Math.round(1000*this.props.currBac)/1000;
    let soberByText = moment.unix(this.props.soberTime).format('hh:mm a');
    let drinkInText = "";
    if (this.props.active && this.props.schedule.length > 0) {
      let earliestScheduleDrink = this.props.schedule[0];
      if (this.state.fastNow < earliestScheduleDrink) {
        drinkInText = this.getTimeText(earliestScheduleDrink - this.state.fastNow);
      } else {
        drinkInText = "NOW!"
      }
    }
    return (
      <div>
        <h2>your predicted BAC</h2>
        <h5>
          current <strong>{currentBacText}</strong> | sober <strong>{soberByText}</strong>{this.props.active ? " | drink " : ""} <strong className="drink-in-text">{drinkInText}</strong>
        </h5>
      </div>
    )
  }
}
