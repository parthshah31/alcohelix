import React, { Component } from 'react';
import LoginComponent from './LoginComponent';
import GraphComponent from './GraphComponent';
import DrinkUpdateComponent from './DrinkUpdateComponent';
import Button from "@material-ui/core/Button";
import Slider from '@material-ui/lab/Slider';
import axios from 'axios';


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      expanded: false,
      weight: 68.5,
      gender: 'M',
      food: 0,
      history: [Date.now() - 10 * 60 * 1000],
      schedule: [],
      active: false,
      goal: 0.08,
      alpha: 1,
      secret: null,
      kerberos: null
    };

    this.fetchHistoryFromServer = () => {
      axios.get('/api/tonight/me', {
        headers: {
          'X-User-Secret': this.state.secret
        }
      }).then((response) => {
        this.setState({
          history: response.data.history
        });
      });
    };

    const oldDataString = window.localStorage.getItem('data');
    if (oldDataString != null) {
      const oldData = JSON.parse(oldDataString); 
      this.state.weight = oldData.weight;
      this.state.kerberos = oldData.kerberos;
      this.state.secret = oldData.secret;
      this.state.gender = oldData.gender;
      this.fetchHistoryFromServer();
    }

    this.onLogin = (data) => {
      window.localStorage.setItem('data', JSON.stringify(data));
      this.setState({
        weight: data.weight,
        kerberos: data.kerberos,
        secret: data.secret,
        gender: data.gender
      });
      this.fetchHistoryFromServer();
    };

    this.addDrink = () => {
      let newHistory = this.state.history
      const ts = Date.now();
      newHistory.push(ts);
      newHistory.sort();
      axios.post('/api/drinks', {
        time: ts
      }, {
        headers: {
          'X-User-Secret': this.state.secret
        }
      }).then((response) => {
        console.log(response);
      });
      this.setState({
        history: newHistory
      });
      this.calcSchedule();
    };

    this.resume = () => {
      this.setState({active: true});
      this.calcSchedule();
    }

    this.pause = () => {
      this.setState({active: false});
    }

    this.calcSchedule = () => {
      let newSchedule = [Date.now()+1*10*1000, Date.now()+1*20*1000, Date.now()+1*30*1000];
      this.setState({
        schedule: newSchedule
      });
    };

    this.clearSchedule = () => {
      this.setState({schedule: []});
    };

    this.handleGoalChange = (event, value) => {
      this.setState({ goal: value });
    };

    this.handleAlphaChange = (event, value) => {
      this.setState({ alpha: value/100 });
    };

    this.toggleScheduleView = () => {
      this.setState({expanded: !this.state.expanded})
    }

    this.reset = () => {
      this.pause();
      this.clearSchedule();
    }
  }


    componentDidMount() {
      this.calcSchedule();
    }

  componentWillUnmount() {}

  render() {
    return (
      <div className="view">
        <div className="logo-container">
          <img className="logo" alt="logo" src={require('./assets/titleinv.png')}/>
        </div>

        { this.state.secret ? (
        <div>
        <div className="expand-container">
        <Button className="mdc-button" onClick={this.toggleScheduleView}>
          <p className="button-text">{ this.state.expanded ? "hide schedule" : "show schedule" }</p>
          <img className={ this.state.expanded ? "arrow arrow-up" : "arrow"} src={require('./assets/arrows.svg')}/>
        </Button>
        </div>

        <div className={this.state.expanded?"sched-expanded":"sched-closed"}>
          <p>
            <strong>State:</strong>
            {this.state.active ? " Getting Lit!!" : " Sobering Up"}
          </p>
          <p><strong>History</strong></p>
          <div className="timelist">
            {this.state.history.map(function(ts, ix) {
              var date = new Date(ts);
              return <li key={ix}>{date.toLocaleTimeString('en-US')}</li>;
            })}
          <div className="expand-container">
            <Button className="mdc-button" onClick={this.toggleScheduleView}>
              <p className="button-text">{ this.state.expanded ? "hide schedule" : "show schedule" }</p>
              <img className={ this.state.expanded ? "arrow arrow-up" : "arrow"} src={require('./assets/arrows.svg')}/>
            </Button>
            </div>

            <p><strong>Scheduled Drinks</strong></p>
            <div className="timelist">
              {this.state.schedule.map(function(ts, ix) {
                var date = new Date(ts);
                return <li key={ix}>{date.toLocaleTimeString('en-US')}</li>;
              })}
            </div>

            <p><strong>Goal BAC:</strong> {this.state.goal}</p>
            <Slider value={this.state.goal} min={0} max={0.2} step={0.02} aria-labelledby="label" onChange={this.handleGoalChange}/>
            
            <p><strong>Alpha:</strong> {this.state.alpha}</p>
            <Slider value={this.state.alpha*100} aria-labelledby="label" onChange={this.handleAlphaChange}/>
          </div>

          <p><strong>Goal BAC:</strong> {this.state.goal}</p>
          <Slider value={this.state.goal} min={0} max={0.2} step={0.02} aria-labelledby="label" onChange={this.handleGoalChange}/>

          <p><strong>Alpha:</strong> {this.state.alpha}</p>
          <Slider value={this.state.alpha*100} aria-labelledby="label" onChange={this.handleAlphaChange}/>
        </div>

        <DrinkUpdateComponent
          active={this.state.active}
          addDrink={this.addDrink}
          resume={this.resume}
          reset={this.reset}
          schedule={this.state.schedule}
        />

        <GraphComponent
          history={this.state.history}
          gender={this.state.gender}
          weight={this.state.weight}
          food={this.state.food}
        />
        </div>
        ) : (
          <LoginComponent onLogin={this.onLogin} />
        ) }
      </div>
    );
  }
}

export default App;
