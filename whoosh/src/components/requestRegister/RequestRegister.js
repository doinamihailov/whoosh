import React, { Component } from "react";
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import Button from '@material-ui/core/Button';
import AuthenticationService from '../../services/AuthentificationService';
let authService = new AuthenticationService();

export default class RequestRegister extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstname: '',
      lastname: '',
      email: '',
      message: '',
      messageModal: '',
      error: '',
      ok: false,
      users:[],
      addModal: false,
    };
  }

  handleChange = (event) => {
    const { value, name } = event.target;
    this.setState({
      [name]: value
    });
  }

    handleOpen = () => {
        this.setState({
            addModal: true,
            messageModal: '',
    })};

    handleClose = () => {
        this.setState({
            addModal: false,
            messageModal: '',
            error: ''
        })
    };

  handleSubmit = event => {
    event.preventDefault();
    if (this.state.firstname.length === 0 || this.state.lastname.length === 0 || this.state.email.length === 0 || this.state.role === '') {
        this.setState({
            error: true
        })
    } else {

        const form = new FormData();
        form.set('email', this.state.email);
        form.set('first_name', this.state.firstname);
        form.set('last_name', this.state.lastname);

        authService.getAllUsers()
        .then((res) => {
          console.log(res)
          var user = [];
          if(res != null)
             user =  JSON.parse(res);
            console.log(user);
          if (user.filter(x => x.email === this.state.email).length !== 0) {
            this.setState({ message: "This email is already registered!" });
          } else {
                this.handleOpen();
                authService.addUser(form)
                    .then((res) => {
                        this.setState({ messageModal: "Your data has been succesfully submited. We will get back to you as soon as possible with further information." });
                    })
                    .catch((err) => {
                        console.error(err);
                        this.setState({
                            messageModal: "There has been an internal problem, please try again later."
                        });
                    })
         }
        })
        .catch((err) => {
          console.error(err);
        })
    }
  }

  render() {
        return (
        <div className="auth-wrapper">
            <div className="auth-inner">
            <form onSubmit={this.handleSubmit}>
                <h3>Register request</h3>
                <h5>You don't have an account? Please complete the data below and 
                    we will get back to you shortly.</h5>
                <Typography variant="subtitle1" color="error">
                {this.state.message}
                </Typography>
                <div className="form-group">
                <label>First Name</label>
                <input type="name"
                    name="firstname"
                    className="form-control"
                    value={this.state.firstname}
                    onChange={this.handleChange}
                    placeholder="Enter first name" />
                </div>
                <div className="form-group">
                <label>Last Name</label>
                <input type="lastname"
                    name="lastname"
                    className="form-control"
                    value={this.state.lastname}
                    onChange={this.handleChange}
                    placeholder="Enter last name" />
                </div>
                <div className="form-group">
                <label>Email address</label>
                <input type="email"
                    name="email"
                    className="form-control"
                    value={this.state.email}
                    onChange={this.handleChange}
                    placeholder="Enter email" />
                </div>
                <button type="submit" className="btn btn-outline-info btn-block">Submit</button>
            </form>

                 <Dialog
                    open={this.state.addModal}
                    onClose={this.handleClose}
                >
                    <DialogContent>
                        <p> {this.state.messageModal}</p>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="outlined" href="/login" color="primary" >
                            Back to login
                        </Button>
                        <br></br>
                        <Button variant="outlined" href="/requestregister" color="secondary" >
                            Send a new request
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </div>
        );
  }
}