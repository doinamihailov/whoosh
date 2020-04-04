import React, { Component } from "react";
import Typography from '@material-ui/core/Typography';
import AuthenticationService from '../../services/AuthentificationService';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

let authService = new AuthenticationService();

export default class ForgottenPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      message: '',
      messageModal: '',
      ok: false,
      users:[]
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

    authService.getAllUsers()
      .then((res) => {
        console.log(res)
        const user = res.filter(x => x.email === this.state.email);
        if (user.length === 0)
            this.setState({message: "Incorrect email address!"});
        else {

          user[0].password = '';

          this.handleOpen();
  
          authService.resetPassUser(user[0])
          .then(() => {
              authService.getAllUsers()
              .then((res) => {
                  console.log(res);
                  this.setState({ messageModal: 'Your information has been processed. You will shortly receive an email with your new password.'})
              })
          })
          .catch(err => {
              console.log(err)
              this.setState({ messageModal: 'There has been an internal problem. Please try again later.'})
          }) 

        }
 

      })
      .catch((err) => {
        console.error(err);
      })

  }

  render() {
      return (
        <div className="auth-wrapper">
          <div className="auth-inner">
            <form onSubmit={this.handleSubmit}>
              <h3>Forgotten Password</h3>
              <Typography variant="subtitle1" color="error">
                {this.state.message}
              </Typography>
              <h5>Please introduce your email address down below and shortly 
                  you will receive your new password in an email.</h5>
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
                    </DialogActions>
                </Dialog>
          </div>
        </div>
      );
  }
}