import React, { Component } from 'react';
import Button from "@material-ui/core/Button";
import moment from 'moment';

export default class DrinkUpdateComponent extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  componentWillUnmount() {
    clearInterval(this.clockInterval);
  }


  render() {
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

    return (
      <div className="drink-container">
      {drinkButton} {scheduleButton}<br></br>
      </div>
    );

  }
};
