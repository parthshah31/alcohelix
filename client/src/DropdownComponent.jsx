import React, { Component } from 'react';
import Button from "@material-ui/core/Button";
import Slider from '@material-ui/lab/Slider';
import moment from 'moment'

export default class DropdownComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      expanded: false
    }

    this.toggleScheduleView = () => {
      this.setState({expanded: !this.state.expanded})
    }
  }

  render() {
    let scheduleGoalView = (
      <div>
      <p><strong>Scheduled Drinks</strong></p>
      <ul className="dropdown-ul">
        {this.props.schedule.map(function(ts, ix) {
          return <li key={ix}>{moment.unix(ts).format('hh:mm a')}</li>;
        })}
      </ul>

      <p><strong>Goal BAC:</strong> {Math.round(this.props.goal*100)/100}</p>
      <Slider value={this.props.goal} min={0.04} max={0.16} step={0.02} aria-labelledby="label" onChange={this.props.handleGoalChange}/>
      <p><strong>Aggressiveness:</strong> {Math.round(this.props.alpha*10)/10}</p>
      <Slider value={this.props.alpha} min={0.0} max={1.0} step={0.1} aria-labelledby="label" onChange={this.props.handleAlphaChange}/>
      </div>
    )

    return (
      <div>
        <div className="expand-container">
        <Button className="mdc-button" onClick={this.toggleScheduleView}>
          <p className="button-text">{ this.state.expanded ? "hide details" : "show details" }</p>
          <img className={ this.state.expanded ? "arrow arrow-up" : "arrow"} src={require('./assets/arrows.svg')}/>
        </Button>
        </div>

        <div className={this.state.expanded?"sched-expanded":"sched-closed"}>
          <p><strong>History</strong></p>
          <div className="timelist">
            <ul className="dropdown-ul">
              {this.props.history.map(function(ts, ix) {
                return <li key={ix}>{moment.unix(ts).format('hh:mm a')}</li>;
              })}
            </ul>
            <Button className="mdc-button" onClick={this.props.resetHistory}>
              <p className="danger-text">Reset History</p>
            </Button>
            {this.props.active ? scheduleGoalView : <div></div>}
          </div>
        </div>
      </div>
    );
  }
};
