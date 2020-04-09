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
import FormControl from '@material-ui/core/FormControl';
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
      openPass: false,
      message: '',
      confirmationPass: '',
      newPass: '',
      oldPass: '',
      error: false,
      messageModal: '',
      addModalOpenMessage: false,
      openEdit: false,
      firstname: '',
      lastname: '',
      email: '',
      pass :'',
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
   handleResetPass = (e) => {
    this.handleClose();
    this.setState({
      openPass: true,
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
    } else if (this.state.newPass === this.state.oldPass){
      this.setState({
          error: true,
          message: 'New password can not be the same with old password.'
      })
    } else {

        const form = new FormData();
        const email = localStorage.getItem("currentEmail");
        form.set('email', email);
        form.set('password', this.state.newPass); 
        console.log(email)
            authService.updatePassUser(form)
            .then((res) => {
                this.setState({ messageModal: "Your password was successfully changed." });
            
                this.handleClosePass();
                this.handleOpenMessage();
            })
            .catch((err) => {
                console.error(err);
                if (err.response.status === 403)
                  this.setState({
                      message: "Old password is incorrect."
                  });
                else{
                  this.setState({
                    messageModal: "There has been an internal problem, please try again later."
                  });
                  this.handleOpenMessage();
                }
            })       
    }
  };

  handleSubmitEdit = event => {
    event.preventDefault();
    if (this.state.firstname === '' || this.state.lastname === '' || this.state.email === '' ) {
        this.setState({
            error: true,
            message: 'All fields are requiered.'
        })
    } else {

        const form = new FormData();
        form.set('email', this.state.email);
        form.set('last_name', this.state.lastname);
        form.set('first_name', this.state.firstname);
        form.set('password', this.state.pass);
        console.log(this.state.email)
        localStorage.setItem("currentEmail", this.state.email);
            authService.editUser(form)
            .then((res) => {
                this.setState({ messageModal: "Your account was successfully changed." });
                this.handleCloseEdit();
                this.handleOpenMessage();
            })
            .catch((err) => {
                console.error(err);
                  this.setState({
                    messageModal: "There has been an internal problem, please try again later."
                  });
                  this.handleOpenMessage();
            })       
    }
  };

  handleDelete = () => {
    this.handleClose();
    const form = new FormData();
    const email = localStorage.getItem("currentEmail");
    form.set('email', email);
    authService.deleteUser(form)
    .then((res) => {
        this.setState({ messageModal: "Your user was erased." });
    
        this.handleClosePass();
        this.handleOpenMessage();
        localStorage.removeItem("currentEmail");
        localStorage.removeItem("token");
        window.location = '/login';
    })
    .catch((err) => {
        console.error(err);
          this.setState({
            messageModal: "There has been an internal problem, please try again later."
          });
          this.handleOpenMessage();
    })
  };

  handleClosePass = (e) => {
    this.setState({
      openPass: false,
      message: null,
      oldPass: '',
      newPass: '',
      confirmationPass: ''
    })
  };
  handleEdit = () => {
    this.handleClose();
    var user= [];
    this.setState({
    })
    authService.getAllUsers()
    .then((res) => {
      user = res.filter(x => x.email === localStorage.getItem("currentEmail"));
      console.log(user[0]);
      this.setState({
        firstname: user[0].first_name,
        lastname: user[0].last_name,
        email: user[0].email,
        pass: user[0].password,
        openEdit: true,
        message: '',
      })
    })
    .catch((err) => {
      console.log(err);
    })
  };
  componentWillMount() {}

  handleCloseEdit = (e) => {
    this.setState({
      openEdit: false,
      message: null,
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
        <MenuItem style={{color: 'black'}} onClick={this.handleResetPass}>Reset password</MenuItem>
        <MenuItem style={{color: 'black'}} onClick={this.handleEdit}>Edit account</MenuItem>
        <MenuItem style={{color: 'red'}} onClick={this.handleDelete}>Delete account</MenuItem>
        </Menu>

    {/*DIALOG FOR CHANGE PASSWORD*/}
        <Dialog
          open={this.state.openPass}
          onClose={this.handleClosePass}
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
          <Button onClick={this.handleClosePass} variant="outlined">
          Cancel
          </Button>
          <Button onClick={this.handleSubmitPass} variant="outlined">
          Submit
          </Button>
          </DialogActions>
        </Dialog>

    {/*DIALOG FOR EDIT USER*/}
    <Dialog
      open={this.state.openEdit}
      onClose={this.handleCloseEdit}
    >
    <DialogTitle id="form-dialog-title">
      <Title class="title-20" title="Edit user" variant="h5" align="left" />
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
            <FormControl>
              <TextField
                name="firstname"
                label="First Name"
                value={this.state.firstname}
                onChange={this.handleChange}
                className="input-width"
                required
                />
            </FormControl>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid item md={12}>
            <TextField
              name="lastname"
              label="Last Name"
              value={this.state.lastname}
              onChange={this.handleChange}
              className="input-width"
              required
            />
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid item md={12}>
            <TextField
              name="email"
              label="Email"
              value={this.state.email}
              onChange={this.handleChange}
              type="email"
              className="input-width"
              required
            />
          </Grid>
        </Grid>
      </DialogContent>
    <DialogActions>
      <Button onClick={this.handleCloseEdit} variant="outlined">
          Cancel
      </Button>
    <Button onClick={this.handleSubmitEdit} variant="outlined">
            Submit
      </Button>
    </DialogActions>
  </Dialog>

    {/*DIALOG FOR CONFIRMATION MESSAGE*/}
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
