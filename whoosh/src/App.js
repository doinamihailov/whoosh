import React, { Component } from "react";
import "./App.css";
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Login from "./components/login/Login";
import ForgottenPassword from "./components/forgottenPassword/ForgottenPassword";
import RequestRegister from "./components/requestRegister/RequestRegister";
import Chat from "./components/chat/Chat";
import Slider from "./components/slider/Slider";
import Settings from "./components/settings/Settings";

import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import ExitToAppRoundedIcon from '@material-ui/icons/ExitToAppRounded';
import ProtectedRoute from './ProtectedRoute';


const styles = (theme) => ({
  root: {
    flexGrow: 1,
  },
  offset: theme.mixins.toolbar,
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  appbar: {
    background: '#000'
  },
  logoutButton: {
    textTransform: 'none',
    color: '#fff',
    paddingRight: '0px',
    marginLeft: '20px'
  },
  menuItem: {
    marginLeft: '15px',
  }
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: false
    };
  }

  componentWillMount() {
    this.handleLogin();
  }

  handleLogin = e => {
    if (localStorage.getItem('token')) {
      this.setState({
        user: true
      })
    }
    else {
      this.setState({
        user: false
      })
    }
  }

  handleLogout = e => {
    e.preventDefault();

    localStorage.removeItem('token');
    localStorage.removeItem('currentEmail')
    window.location = '/login';
    this.setState({
      user: false
    })
  }

  render() {
    const { classes } = this.props;

    if (this.state.user === true) {
      return (
        <Router>
          <header>
            <div className={classes.root}>
              <AppBar position="fixed" className={classes.appbar}>
                <Toolbar>
                  <Typography variant="h6" className={classes.title}>
                    <Link to="/login" className="link">
                      Whoosh
                    </Link>
                  </Typography>

                  <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    onClick={this.handleLogout}
                  >
                    <ExitToAppRoundedIcon className={classes.logoutButton} />
                  </IconButton>

                  <Settings/>

                </Toolbar>
              </AppBar>
              <div className={classes.offset} />
            </div>
          </header >

          <div className="App">
            <Switch>
              <Route exact path='/login' handleLogin={this.handleLogin} render={props => <Login {...props} user={this.state.user.toString()} handleLogin={this.handleLogin} />} />
              <ProtectedRoute exact path='/' handleLogin={this.handleLogin} render={props => <Login {...props} user={this.state.user.toString()} handleLogin={this.handleLogin} />} />
              <Route exact path='/forgottenpassword' component={ForgottenPassword} />
              <Route exact path='/requestregister' component={RequestRegister} />
              <Route exact path='/chat' component={Chat} />
              <Route exact path='/slider' component={Slider} />
            </Switch>
          </div>
        </Router>
      );
    } else {
      return (
        <Router>
          <div className="AppLogin">
            <Switch>
              <Route exact path='/login' handleLogin={this.handleLogin} render={props => <Login {...props} user={this.state.user.toString()} handleLogin={this.handleLogin} />} />
              <ProtectedRoute exact path='/' handleLogin={this.handleLogin} render={props => <Login {...props} user={this.state.user.toString()} handleLogin={this.handleLogin} />} />
              <Route exact path='/forgottenpassword' component={ForgottenPassword} />
              <Route exact path='/requestregister' component={RequestRegister} />
              <Route exact path='/chat' component={Chat} />
              <Route exact path='/slider' component={Slider} />
            </Switch>
          </div>
        </Router>
      );
    }
  }
}

export default (withStyles(styles)(App));