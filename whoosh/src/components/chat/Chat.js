import React, { Component } from "react";
import "./Chat.css";
import Title from '../title/Title';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import AuthenticationService from '../../services/AuthentificationService';
let authService = new AuthenticationService();

class Chat extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '', 
      firstname: '',
      lastname: '',
      message: '',
      addModal: false,
    };
    const email = localStorage.getItem("currentEmail");

    var user= [];

    authService.getAllUsers()
        .then((res) => {
            user = res.filter(x => x.email === email);
            this.setState({
              email: email,
              firstname: user[0].first_name,
              lastname: user[0].last_name,
              message: "Welcome, " + user[0].first_name + "!"
            })
        })
        .catch((err) => {
        console.log(err);
        })
  }

  handleClose = () => {
    this.setState({
        addModal: false,
    })
};

  render() {
    return (
      <div className="card page">
        <Title title={this.state.message} class="title-80" variant="h4" align="center" />
        <div
          style={{
              position: 'absolute', left: '50%', top: '30%',
              transform: 'translate(-50%, -50%)'
          }}
          >
        <Button variant="outlined" color="primary"onClick={() => { this.setState({addModal: true}) }}>Start a conversation</Button>
        <br></br>
        <br></br>
        </div>
        <div
          style={{
              position: 'absolute', left: '50%', top: '40%',
              transform: 'translate(-50%, -50%)'
          }}
          >
        <h6 >  Search for someone to start chatting with.</h6>
        </div>

        {/*DIALOG FOR SEARCHING CONTACT*/}
        <Dialog
            open={this.state.addModal}
            onClose={this.handleClose}
        >
           <DialogTitle id="form-dialog-title">
            <Title class="title-20" title="New chat" variant="h5" align="left" />
          </DialogTitle>
          <DialogContent>
              <p> Search bar</p>
          </DialogContent>
          <DialogActions>
              <Button onClick={this.handleClose} variant="outlined">
                  x
              </Button>
          </DialogActions>
        </Dialog>


      </div >
    );
  }
}

export default Chat;
