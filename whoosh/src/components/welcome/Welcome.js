import React, { Component, Fragment } from "react";
import "./Welcome.css";
import Title from '../title/Title';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Autocomplete from '@material-ui/lab/Autocomplete';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";

import TollSharpIcon from '@material-ui/icons/TollSharp';

import AuthenticationService from '../../services/AuthentificationService';
let authService = new AuthenticationService();

class Welcome extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '', 
      firstname: '',
      lastname: '',
      message: '',
      addModal: false,
      users: [],
      selectedContact: {email:''},
    };
  }

  componentWillMount() {
    this.startWelcome();
  }

  startWelcome() {
    const email = localStorage.getItem("currentEmail");

    var user= [];

    authService.getAllUsers()
        .then((res) => {
            user = res.filter(x => x.email === email);
            this.setState({
              email: email,
              firstname: user[0].first_name,
              lastname: user[0].last_name,
              message: "Welcome, " + user[0].first_name + "!",
              users: res,
            });
            //console.log(this.state.users);
        })
        .catch((err) => {
        console.log(err);
        })
  }

  handleChangeContact(newValue) {
    this.setState({
      selectedContact: newValue
  })
  }

  renderIcon = (el) => {
    if(el.online === 'false')
      return (
        <IconButton>
          <TollSharpIcon style={{ fill:'#e57373' }} />
        </IconButton>
      );
    return (
      <IconButton>
        <TollSharpIcon style={{ fill:'#76ff03' }}/>
      </IconButton>
      );
  }

  handleSelect = () => {
    console.log(this.state.selectedContact);
    this.setState({
        addModal: false,
    })
  };

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
              <p> Please select a contact</p>
              <FormControl>
                  <Autocomplete
                    id="tags-standard"
                    size="small"
                    style={{ width: 300 }}
                    className="autoselect"
                    options={this.state.users}
                    getOptionLabel={(option) => option.email}
                    renderOption={(option) => {
                      return (
                        <Fragment>
                          {option.email}
                          {this.renderIcon(option)}
                        </Fragment>
                      );

                    }
                    }
                    value={this.state.selectedContact}
                    onChange={(event, newValue) => {
                        this.handleChangeContact(newValue)
                    }}
                    renderInput={(params) => (
                    <div>
                      <TextField
                       {...params}
                        variant="standard"
                        label=""
                       placeholder="Search"     
                      />
                   </div>
                  )}
                  />
              </FormControl>
          </DialogContent>
          <DialogActions>
              <Button onClick={this.handleSelect} color="primary">
                  Select
              </Button>
              <Button onClick={this.handleClose} color="secondary">
                  Cancel
              </Button>
          </DialogActions>
        </Dialog>


      </div >
    );
  }
}

export default Welcome;
