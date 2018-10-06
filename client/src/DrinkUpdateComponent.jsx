import React, { Component } from 'react';

export default class DrinkUpdateComponent extends Component {
  render() {
    return (
      <div>
        <h2>drink update</h2>
        <button onClick={this.props.addDrink}>Add Drink</button>
      </div>
    );
  }
};
