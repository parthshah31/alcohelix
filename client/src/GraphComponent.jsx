import React, { Component } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { bacSeries } from './engine.mjs'

export default class GraphComponent extends Component {

  render() {

    let startTime = Date.now();
    if (this.props.history.length > 0) {
      startTime = this.props.history[0] - 10 * 60 * 1000
    }
    let endTime = Date.now() + 240 * 60 * 1000;

    let series = bacSeries(
      this.props.history,
      this.props.gender,
      this.props.weight,
      this.props.food,
      startTime,
      endTime,
      60 * 1000
    );

    let time = series[0];
    let bac = series[1];
    console.log(bac);

    const data = [];
    for (var i=0; i<time.length; i++) {
      let date = new Date(time[i]);
      let hour = date.getHours();
      let min = date.getMinutes();
      let ampm = (hour >= 12) ? "PM" : "AM";
      hour = (hour % 12 < 10) ? "0" + (hour%12) : hour%12;
      min = (min % 60 < 10) ? "0" + (min%60) : min%60;

      data.push({x: `${hour}:${min} ${ampm}`, y: bac[i]});
    }

    return (
      <div className="graph-container">
        <h2>graph component</h2>
        	<LineChart data={data} width={600} height={400} margin={{top: 20, right: 20, bottom: 20, left: 20}}>
          	<CartesianGrid/>
            <XAxis type="category" dataKey={'x'} name='time'/>
          	<YAxis />
          	<Line name='bac' dataKey="y" stroke='#6ae5db' strokeWidth={5} dot={false}/>
          </LineChart>
      </div>
    );
  }
};
