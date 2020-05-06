import React, { Component } from "react";
import axios from 'axios';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Background from '../../images/cl.jpeg';

const URL = process.env.REACT_APP_URL;

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      message: '',
    };
    this.myStorage = window.localStorage;
  }

  handleChange = (event) => {
    const { value, name } = event.target;
    this.setState({
      [name]: value
    });
  }
  handleSubmit = event => {
    event.preventDefault();
    const data = {
      email: this.state.email,
      password: this.state.password
    }

    const form = new FormData();
    form.set('email', data.email);
    form.set('password', data.password);
    console.log(URL);
    axios.post(URL + '/users/login', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
      .then(res => {
        console.log("token:" + res.data.token);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("currentEmail", data.email);
        this.props.handleLogin()
        this.props.history.push('/welcome')
        console.log(this.props.history)
      })
      .catch(error => {
        console.log(error);
        if (error.response.status === 403)
          this.setState({
            message: "Incorrect password!"
          });
        else
          this.setState({
            message: "Incorrect email address!"
          });
      });

  }
  render() {
    return (
      <div className="auth-wrapper">
        <div className="auth-inner" style={{ backgroundImage: `url(${Background})`}}>
          <form onSubmit={this.handleSubmit}>
            <h3>Log In</h3>
            <Typography variant="subtitle1" color="error">
              {this.state.message}
            </Typography>
            <div className="form-group">
              <label>Email address</label>
              <input type="email"
                name="email"
                className="form-control"
                value={this.state.email}
                onChange={this.handleChange}
                placeholder="Enter email" />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input type="password"
                name="password"
                className="form-control"
                value={this.state.password}
                onChange={this.handleChange}
                placeholder="Enter password" />
            </div>
            <button type="submit" className="btn btn-outline-info btn-block">Submit</button>
          </form>
          <br></br>
          <Button variant="outlined" href="/requestregister" color="secondary" >
            New user
          </Button>
          <br></br>
          <Link
            component="button"
            variant="body2"
            onClick={() => {
              window.location = "/forgottenPassword"
            }}
          >
            Forgot your password?
          </Link> 
        </div>
      </div>
    );
  }
}