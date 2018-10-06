import React, { Component } from 'react';

export default class WarningComponent extends Component {
  render() {
    return (
      <div>
        <h2>warning component</h2>
        <h5>next time: {this.props.user.schedule[0]}</h5>
      </div>
    );
  }
};
