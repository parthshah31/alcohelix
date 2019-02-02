import React, { Component } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer} from 'recharts';
import StatsComponent from './StatsComponent';
import { getBacSeries, getIdealControlSeries } from './engine.mjs'
import moment from 'moment'

export default class GraphComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      now: moment().unix(),
    };

    this.updateNow = () => {
      this.setState({now: moment().unix()});
    }
  }

  componentDidMount() {
    this.clockInterval = setInterval(
      this.updateNow,
      1 * 60 * 1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.clockInterval);
  }

  render() {
    let startBuffer = 20 * 60;
    let startTime = this.state.now - startBuffer;
    if (this.props.history.length > 0) {
      startTime = this.props.history[0] - startBuffer
    }
    startTime = 30 * 60 * Math.floor(startTime / 30 / 60);

    let endTime = this.state.now + this.props.scheduleHours * 60 * 60;
    let dt = 60;
    let timeRange = [];
    for (var t=startTime; t<endTime; t+=30*60){
      timeRange.push(t);
    }

    let data = [];
    let currBac = -1.0;

    let freeSeries = getBacSeries(
      0.0,
      0.0,
      this.props.history,
      this.props.gender,
      this.props.weight,
      this.props.food,
      startTime,
      this.state.now,
      endTime,
      dt
    );

    let controlSeries = getBacSeries(
      0.0,
      0.0,
      this.props.history.concat(this.props.schedule),
      this.props.gender,
      this.props.weight,
      this.props.food,
      startTime,
      this.state.now,
      endTime,
      dt
    );

    let idealControlSeries = getIdealControlSeries(
      0.0,
      0.0,
      this.props.history,
      this.props.gender,
      this.props.weight,
      this.props.food,
      startTime,
      this.state.now,
      endTime,
      dt,
      this.props.goal,
      this.props.alpha
    );

    let freeTime = freeSeries[0];
    let freeBac = freeSeries[1];
    let soberTime = freeSeries[3];
    let controlTime = controlSeries[0];
    let controlBac = controlSeries[1];
    let idealControlTime = idealControlSeries[0];
    let idealControlBac = idealControlSeries[1];

    let hist_i = 0;
    let control_i = 0;
    for (var i=0; i<freeTime.length; i++) {
      let time = freeTime[i];

      let d = {
        x: freeTime[i],
        goal: this.props.goal
      }

      let overlap = false;
      if (time < this.state.now) {
        d['past'] = freeBac[i];
      } else {
        if (!overlap){
          d['past'] = freeBac[i];
          overlap = true;
        }
        d['future'] = freeBac[i];
      }

      let latestActive = (this.props.history.length > 0) ?
        this.props.history[this.props.history.length-1]: this.state.now;
      if (this.props.active && (time >= latestActive)) {
        d['control'] = controlBac[i];
        d['idealControl'] = idealControlBac[i];
      }
      if (time > this.state.now && time - this.state.now < dt) {
        d['current-dot'] = freeBac[i];
        currBac = freeBac[i];
      }

      while (hist_i < this.props.history.length &&
        this.props.history[hist_i] - time < dt) {
          d['history-dots'] = freeBac[i];
          hist_i++;
      }
      while (this.props.active && control_i < this.props.schedule.length &&
          time - this.props.schedule[control_i] > dt) {
          d['control-dots'] = controlBac[i];
          control_i++;
      }

      data.push(d);
    }

    return (
      <div className="graph-container">
        <StatsComponent
          fastNow={this.state.fastNow}
          active={this.props.active}
          schedule={this.props.schedule}
          currBac={currBac}
          soberTime={soberTime}
        />
        <ResponsiveContainer height="90%">
        <LineChart data={data} margin={{top: 20, right: 10, bottom: 20, left: 10}}>
        	<CartesianGrid/>
          <XAxis
            type="number"
            domain={[startTime, endTime]}
            dataKey={'x'}
            name='time'
            tickFormatter={(tick) => moment.unix(tick).format("hh:mm a")}
            ticks={timeRange}
          />
        	<YAxis />
          <Line name='goal' dataKey="goal" stroke='#ffffff' strokeWidth={4} dot={false}/>
          <Line name='idealControl' dataKey="idealControl" stroke='#58ff49' strokeWidth={5} dot={false}/>
          <Line name='control' dataKey="control" stroke='#ff6600' strokeWidth={5} dot={false}/>
          <Line name='past' dataKey="past" stroke='#00665D' strokeWidth={5} dot={false}/>
          <Line name='future' dataKey="future" stroke='#6ae5db' strokeWidth={5} dot={false}/>
          <Line name='history-dots' dataKey="history-dots" dot={{stroke:'#00665D', strokeWidth:12}} isAnimationActive={false}/>
          <Line name='control-dots' dataKey="control-dots" dot={{stroke:'#ff6600', strokeWidth:12}} isAnimationActive={false}/>
          <Line name='current-dot' dataKey="current-dot" dot={{stroke:'#6ae5db', strokeWidth:7}} isAnimationActive={false}/>

        </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }
};
