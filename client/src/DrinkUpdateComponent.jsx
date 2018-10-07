import React, { Component } from 'react';
import Button from "@material-ui/core/Button";

export default class DrinkUpdateComponent extends Component {
  render() {
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
        </div>
      )
    }

  }
};
