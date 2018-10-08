import React, { Component } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { bacSeries } from './engine.mjs'

export default class GraphComponent extends Component {
  render() {

    let now = Date.now()

    let startTime = now - 10 * 60 * 1000;
    if (this.props.history.length > 0) {
      startTime = this.props.history[0] - 10 * 60 * 1000
    }
    let endTime = now + 240 * 60 * 1000;
    let dt = 60 * 1000;

    let data = [];

    if (false) {
      let pastSeries = bacSeries(
        0.0,
        0.0,
        this.props.history,
        this.props.gender,
        this.props.weight,
        this.props.food,
        startTime,
        now+dt,
        dt
      );

      console.log(pastSeries[1][20]);
      let futureSeries = bacSeries(
        pastSeries[2][0],
        pastSeries[2][1],
        this.props.schedule,
        this.props.gender,
        this.props.weight,
        this.props.food,
        now,
        endTime,
        dt
      );

      let pastTime = pastSeries[0];
      let pastBac = pastSeries[1];
      let futureTime = futureSeries[0];
      let futureBac = futureSeries[1];


      for (var i=0; i<pastTime.length; i++) {
        let date = new Date(pastTime[i]);
        let hour = date.getHours();
        let min = date.getMinutes();
        let ampm = (hour >= 12) ? "PM" : "AM";
        hour = (hour % 12 < 10) ? "0" + (hour%12) : hour%12;
        min = (min % 60 < 10) ? "0" + (min%60) : min%60;

        data.push({x: `${hour}:${min} ${ampm}`, past: pastBac[i]});
      }

      for (var j=0; j<futureTime.length; j++) {
        let date = new Date(futureTime[j]);
        let hour = date.getHours();
        let min = date.getMinutes();
        let ampm = (hour >= 12) ? "PM" : "AM";
        hour = (hour % 12 < 10) ? "0" + (hour%12) : hour%12;
        min = (min % 60 < 10) ? "0" + (min%60) : min%60;

        data.push({x: `${hour}:${min} ${ampm}`, future: futureBac[j]});
      }
    } else {
      let pastSeries = bacSeries(
        0.0,
        0.0,
        this.props.history,
        this.props.gender,
        this.props.weight,
        this.props.food,
        startTime,
        endTime,
        dt
      );

      let pastTime = pastSeries[0];
      let pastBac = pastSeries[1];

      for (var i=0; i<pastTime.length; i++) {
        let date = new Date(pastTime[i]);
        let hour = date.getHours();
        let min = date.getMinutes();
        let ampm = (hour >= 12) ? "PM" : "AM";
        hour = (hour % 12 < 10) ? "0" + (hour%12) : hour%12;
        min = (min % 60 < 10) ? "0" + (min%60) : min%60;

        data.push({x: `${hour}:${min} ${ampm}`, past: pastBac[i]});
      }
    }

    return (
      <div className="graph-container">
        <h2>graph component</h2>
        	<LineChart data={data} width={600} height={400} margin={{top: 20, right: 20, bottom: 20, left: 20}}>
          	<CartesianGrid/>
            <XAxis type="category" dataKey={'x'} name='time'/>
          	<YAxis />
          	<Line name='bac' dataKey="past" stroke='#6ae5db' strokeWidth={5} dot={false}/>
            <Line name='bac' dataKey="future" stroke='#ff6600' strokeWidth={5} dot={false}/>
          </LineChart>
      </div>
    );
  }
};
