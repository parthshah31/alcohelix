import React, { Component } from 'react';

export default class DrinkUpdateComponent extends Component {
  render() {
    if (!this.props.active) {
      return (
        <div>
          <h2>drink update</h2>
          <button onClick={this.props.resume}>{"Start!"}</button>
        </div>
      );
    } else {
      return (
        <div>
          <h2>drink update</h2>
          <button onClick={this.props.addDrink}>{"Add Drink"}</button><br></br>
          <button onClick={this.props.reset}>{"Stop Drinking"}</button>
        </div>
      )
    }

  }
};
