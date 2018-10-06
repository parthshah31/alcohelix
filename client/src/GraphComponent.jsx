import React, { Component } from 'react';
import { LineChart, Line } from 'recharts';

export default class GraphComponent extends Component {
  render() {
    const data = [
      {uv: 1},
      {uv: 2},
      {uv: 3},
      {uv: 4},
      {uv: 5}
    ];

    return (
      <div>
        <h2>graph component</h2>
        <LineChart width={400} height={400} data={data}>
          <Line type="monotone" dataKey="uv" stroke="blue" />
        </LineChart>
      </div>
    );
  }
};
