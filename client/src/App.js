import React, { Component } from 'react';
import LoginComponent from './LoginComponent';
import GraphComponent from './GraphComponent';
import DropdownComponent from './DropdownComponent';
import DrinkUpdateComponent from './DrinkUpdateComponent';
import Button from "@material-ui/core/Button";
import Slider from '@material-ui/lab/Slider';
import { getControlSchedule } from './engine.mjs'
import axios from 'axios';
import moment from 'moment'


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      weight: 150,
      gender: 'M',
      food: '1',
      history: [
        // moment().unix()-90*60,
        // moment().unix()-80*60,
        // moment().unix()-10*60,
      ],
      schedule: [],
      scheduleHours: 6,
      active: true,
      goal: 0.1,
      alpha: 0.5,
      secret: true,
      kerberos: null
    };

    // this.fetchHistoryFromServer = () => {
    //   axios.get('/api/tonight/me', {
    //     headers: {
    //       'X-User-Secret': this.state.secret
    //     }
    //   }).then((response) => {
    //     this.setState({
    //       history: response.data.history
    //     });
    //   });
    // };

    // const oldDataString = window.localStorage.getItem('data');
    // if (oldDataString != null) {
    //   const oldData = JSON.parse(oldDataString);
    //   this.state.weight = oldData.weight;
    //   this.state.kerberos = oldData.kerberos;
    //   this.state.secret = oldData.secret;
    //   this.state.gender = oldData.gender;
    //   // this.fetchHistoryFromServer();
    // }
    //
    // this.onLogin = (data) => {
    //   window.localStorage.setItem('data', JSON.stringify(data));
    //   this.setState({
    //     weight: data.weight,
    //     kerberos: data.kerberos,
    //     secret: data.secret,
    //     gender: data.gender
    //   });
      // this.fetchHistoryFromServer();
    // };

    this.addDrink = () => {
      let newHistory = this.state.history
      const ts = moment().unix();
      newHistory.push(ts);
      newHistory.sort();
      // axios.post('/api/drinks', {
      //   time: ts
      // }, {
      //   headers: {
      //     'X-User-Secret': this.state.secret
      //   }
      // }).then((response) => {
      //   console.log(response);
      // });
      this.setState({
        history: newHistory,
        schedule: this.calcSchedule(
          newHistory,
          this.state.goal,
          this.state.alpha,
          this.state.gender,
          this.state.weight,
          this.state.food
        )
      });
    }

    this.resume = () => {
      this.setState({
        active: true,
        schedule: this.calcSchedule(
          this.state.history,
          this.state.goal,
          this.state.alpha,
          this.state.gender,
          this.state.weight,
          this.state.food)
      });
    }

    this.calcSchedule = (history, goal, alpha, gender, weight, food) => {
      let now = moment().unix();
      let newSchedule = getControlSchedule(
        0.0,
        0.0,
        history,
        gender,
        weight,
        food,
        history.length > 0 ? history[0] : now,
        now,
        now + this.state.scheduleHours * 60 * 60,
        60,
        goal,
        alpha
      )
      return newSchedule;
    };

    this.handleGenderChange = (event) => {
      this.setState({
        gender: event.target.value,
        schedule: this.calcSchedule(
          this.state.history,
          this.state.goal,
          this.state.alpha,
          event.target.value,
          this.state.weight,
          this.state.food)
      });
    };

    this.handleFoodChange = (event) => {
      this.setState({
        food: event.target.value,
        schedule: this.calcSchedule(
          this.state.history,
          this.state.goal,
          this.state.alpha,
          this.state.gender,
          this.state.weight,
          event.target.value)
      });
    };

    this.handleWeightChange = (event) => {
      if (event.target.value <= 0) {
        this.setState({
          weight: 1
        });
      } else {
        this.setState({
          weight: event.target.value,
          schedule: this.calcSchedule(
            this.state.history,
            this.state.goal,
            this.state.alpha,
            this.state.gender,
            event.target.value,
            this.state.food)
        });
      }
    };

    this.handleGoalChange = (event, value) => {
      this.setState({
        goal: value,
        schedule: this.calcSchedule(
          this.state.history,
          value,
          this.state.alpha,
          this.state.gender,
          this.state.weight,
          this.state.food)
      });
    }

    this.handleAlphaChange = (event, value) => {
      this.setState({
        alpha: value,
        schedule: this.calcSchedule(
          this.state.history,
          this.state.goal,
          value,
          this.state.gender,
          this.state.weight,
          this.state.food)
      });
    }

    this.deleteOneHistory = () => {
      if (this.state.history.length > 0){
        let newHistory = this.state.history.slice(0, this.state.history.length-1);
        this.setState({
          history: newHistory,
          schedule: this.calcSchedule(
            newHistory,
            this.state.goal,
            this.state.alpha,
            this.state.gender,
            this.state.weight,
            this.state.food)
        });
      }
    }

    this.resetSchedule = () => {
      this.setState({
        active: false,
        schedule: []
      });
    }

    this.resetHistory = () => {
      // axios.post('/api/reset',
      // {},
      // {
      //   headers: {
      //     'X-User-Secret': this.state.secret
      //   }
      // }).then((response) => {
      //   console.log(response);
      // });
      this.setState({
        history: [],
        schedule: this.calcSchedule(
          [],
          this.state.goal,
          this.state.alpha,
          this.state.gender,
          this.state.weight,
          this.state.food)
      });
    }
  }

  componentDidMount() {
    this.setState({
      schedule: this.calcSchedule(
        this.state.history,
        this.state.goal,
        this.state.alpha,
        this.state.gender,
        this.state.weight,
        this.state.food)
    });
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
          <DropdownComponent
            active={this.state.active}
            goal={this.state.goal}
            alpha={this.state.alpha}
            gender={this.state.gender}
            weight={this.state.weight}
            food={this.state.food}
            handleGoalChange={this.handleGoalChange}
            handleAlphaChange={this.handleAlphaChange}
            handleGenderChange={this.handleGenderChange}
            handleWeightChange={this.handleWeightChange}
            handleFoodChange={this.handleFoodChange}
            history={this.state.history}
            schedule={this.state.schedule}
            resetHistory={this.resetHistory}
            deleteOneHistory={this.deleteOneHistory}
          />

          <GraphComponent
            history={this.state.history}
            schedule={this.state.schedule}
            scheduleHours={this.state.scheduleHours}
            active={this.state.active}
            goal={this.state.goal}
            alpha={this.state.alpha}
            gender={this.state.gender}
            weight={this.state.weight}
            food={this.state.food}
          />

          <DrinkUpdateComponent
            active={this.state.active}
            addDrink={this.addDrink}
            resume={this.resume}
            resetSchedule={this.resetSchedule}
            schedule={this.state.schedule}
          />
          <br></br>
          <br></br>

        </div>
        ) : (
          <LoginComponent onLogin={this.onLogin} />
        ) }
      </div>
    );
  }
}

export default App;
