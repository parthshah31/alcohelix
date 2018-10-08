import React, { Component } from 'react';
import axios from 'axios';

export default class LoginComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      kerberos: '',
      gender: 'M',
      weight: 150
    };
  }

  updateKerberos = (e) => {
    this.setState({
      kerberos: e.target.value
    });
  }

  updateGender = (e) => {
    this.setState({
      gender: e.target.value
    });
  }

  updateWeight = (e) => {
    this.setState({
      weight: e.target.value
    });
  }

  submitForm = (e) => {
    e.preventDefault();
    axios.post('/api/account', {
      kerberos: this.state.kerberos,
      gender: this.state.gender,
      weight: this.state.weight
    }).then((response) => {
      this.props.onLogin(response.data);
    }).then((error) => {
      console.log(error);
    });
  }

  render() {
    return (<div className="login-container">
      <h1>Login</h1>
      <form onSubmit={this.submitForm}>
        <h4>Kerberos</h4>
        <input type="text" placeholder="kerberos" value={this.state.kerberos} onChange={this.updateKerberos} />
        <br />
        <h4>Gender</h4>
        <select value={this.state.gender} onChange={this.updateGender}>
          <option value="M">male</option>
          <option value="F">female</option>
        </select>
        <br />
        <h4>Weight (lbs)</h4>
        <input type="number" value={this.state.weight} onChange={this.updateWeight} />
        <br />
        <h4></h4>
        <input type="submit" value="Login" />
      </form>
    </div>);
  }
}
