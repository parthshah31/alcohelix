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
        <div className="timelist">
          <p><strong>scheduled drinks</strong></p>
          <ul className="dropdown-ul">
            {this.props.schedule.map(function(ts, ix) {
              return <li key={ix}>{moment.unix(ts).format('hh:mm a')}</li>;
            })}
          </ul>
        </div>
        <div className="sliders">
          <p><strong>goal BAC:</strong> {Math.round(this.props.goal*100)/100}</p>
          <Slider value={this.props.goal} min={0.04} max={0.16} step={0.02} aria-labelledby="label" onChange={this.props.handleGoalChange}/>
          <p><strong>aggressiveness:</strong> {Math.round(this.props.alpha*10)/10}</p>
          <Slider value={this.props.alpha} min={0.0} max={1.0} step={0.1} aria-labelledby="label" onChange={this.props.handleAlphaChange}/>
        </div>
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
          <div className="user-details">
            <p><strong>about you</strong></p>
            <select value={this.props.gender} onChange={this.props.handleGenderChange}>
              <option value='M'>male</option>
              <option value='F'>female</option>
            </select>

            <label>
              weight
              <input type='number' step='10' min='80' max='400' value={this.props.weight} onChange={this.props.handleWeightChange} />
            </label>

            <select value={this.props.food} onChange={this.props.handleFoodChange}>
              <option value='0'>no food</option>
              <option value='1'>some food</option>
              <option value='2'>lots of food</option>
            </select>
          </div>

          <div className="timelist">
            <p><strong>history</strong></p>

            <ul className="dropdown-ul">
              {this.props.history.map(function(ts, ix) {
                return <li key={ix}>{moment.unix(ts).format('hh:mm a')}</li>;
              })}
            </ul>
            <Button className="mdc-button" onClick={this.props.deleteOneHistory}>
              <p className="danger-text">delete last drink</p>
            </Button>
            <Button className="mdc-button" onClick={this.props.resetHistory}>
              <p className="danger-text">delete all</p>
            </Button>
            </div>
            {this.props.active ? scheduleGoalView : <div></div>}
        </div>
      </div>
    );
  }
};
