import React, { Component } from "react";
import "./Settings.css";
import Title from '../title/Title';
import SettingsIcon from '@material-ui/icons/Settings';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';
import AuthenticationService from '../../services/AuthentificationService';

let authService = new AuthenticationService();

const URL = process.env.REACT_APP_URL;
class Settings extends Component {

  constructor(props) {
    super(props);
    this.state = {
      user: false,
      anchorEl: null,
      openModal: false,
      message: '',
      confirmationPass: '',
      newPass: '',
      oldPass: '',
      error: false,
      messageModal: '',
      addModalOpenMessage: false,
    };
  }
  handleClick = (event) => {
    this.setState({
        anchorEl: event.currentTarget,
    })
  };
  handleClose = () => {
        this.setState({
        anchorEl: null
        })
   };
   handleReset = (e) => {
    this.handleClose();
    this.setState({
      openModal: true,
      message: null
    })
  };

  handleChange = (event) => {
    const { value, name } = event.target;
    this.setState({
      [name]: value
    });
  }

  handleSubmitPass = event => {
    event.preventDefault();
    if (this.state.confirmationPass === '' || this.state.newPass === '' || this.state.oldPass === '' ) {
        this.setState({
            error: true,
            message: 'All fields are requiered.'
        })
    } else if (this.state.newPass !== this.state.confirmationPass){
        this.setState({
            error: true,
            message: 'New password and confirmation password are not the same.'
        })
    } else {

        const form = new FormData();
        form.set('email', this.state.email);
        form.set('first_name', this.state.firstname);    
        form.set('last_name', this.state.lastname);

        authService.getAllUsers()
        .then((res) => {
          var user = [];
          const email = localStorage.getItem('currentEmail');
          console.log(res);
          if(res != null)
             user =  res.filter(x => x.email === email);
             const form = new FormData();
            form.set('email', user[0].email);
            form.set('first_name', user[0].firstname);    
            form.set('last_name', user[0].lastname);
            form.set('password', this.state.newPass);
            authService.updatePassUser(form)
            .then((res) => {
                this.setState({ messageModal: "Your password was successfully changed." });
            })
            .catch((err) => {
                console.error(err);
                this.setState({
                messageModal: "There has been an internal problem, please try again later."
                });
            })
            
            this.handleCloseModal();
            this.handleOpenMessage();
        })
        .catch((err) => {
          console.error(err);
        })
    }
  };

  handleCloseModal = (e) => {
    this.setState({
      openModal: false,
      message: null,
      oldPass: '',
      newPass: '',
      confirmationPass: ''
    })
  };


  handleOpenMessage = () => {
    this.setState({
        addModalOpenMessage: true
    })
    };
    handleCloseMessage = () => {
        this.setState({
            addModalOpenMessage: false,
            messageModal: '',
        })
    };
  render() {
    return (
        <div>
        <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={this.handleClick}
            >
        <SettingsIcon/>
        </IconButton>
        
        <Menu
            id="simple-menu"
            anchorEl={this.state.anchorEl}
            keepMounted
            open={Boolean(this.state.anchorEl)}
            onClose={this.handleClose}
        >
        <MenuItem style={{color: 'black'}} onClick={this.handleReset}>Reset password</MenuItem>
        <MenuItem style={{color: 'black'}} onClick={this.handleClose}>Edit account</MenuItem>
        <MenuItem style={{color: 'red'}} onClick={this.handleClose}>Delete account</MenuItem>
        </Menu>


        <Dialog
          open={this.state.openModal}
          onClose={this.handleCloseModal}
        >
          <DialogTitle id="form-dialog-title">
            <Title class="title-20" title="Change password" variant="h5" align="left" />
          </DialogTitle>
          <DialogContent>
          <Grid container spacing={3}>
            <Grid item md={12}>
              <Typography variant="subtitle1" color="error">
              {this.state.message}
              </Typography>
            </Grid>
          </Grid>
          <Grid container spacing={3}>
          <Grid item md={12}>
          <TextField
            name="oldPass"
            label="Old Password"
            value={this.state.oldPass}
            onChange={this.handleChange}
            type="password"
            className="input-width"
            error={this.state.oldPass.length === 0 && this.state.error !== ''}
            required
          />
          </Grid>
          </Grid>
          <Grid container spacing={3}>
          <Grid item md={12}>
          <TextField
            name="newPass"
            label="New Password"
            value={this.state.newPass}
            onChange={this.handleChange}
            type="password"
            className="input-width"
            error={this.state.newPass.length === 0 && this.state.error !== ''}
            required
          />
          </Grid>
          </Grid>
          <Grid container spacing={3}>
          <Grid item md={12}>
          <TextField
          name="confirmationPass"
          label="Confirm"
          value={this.state.confirmationPass.value}
          onChange={this.handleChange}
          type="password"
          className="input-width"
          error={this.state.confirmationPass.length === 0 && this.state.error !== ''}
          required
          />
          </Grid>
          </Grid>
          </DialogContent>
          <DialogActions>
          <Button onClick={this.handleCloseModal} variant="outlined">
          Cancel
          </Button>
          <Button onClick={this.handleSubmitPass} variant="outlined">
          Submit
          </Button>
          </DialogActions>
        </Dialog>

        <Dialog
            open={this.state.addModalOpenMessage}
            onClose={this.handleCloseMessage}
        >
        <DialogContent>
            <p> {this.state.messageModal}</p>
        </DialogContent>
        <DialogActions>
            <Button onClick={this.handleCloseMessage} variant="outlined">
                 x
            </Button>
        </DialogActions>
        </Dialog>
        </div>
    );
  }
}

export default Settings;
