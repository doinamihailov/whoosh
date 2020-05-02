import React, { Component } from "react";
import Button from '@material-ui/core/Button';
import "./Chat.css";
import Title from '../title/Title';
import IconButton from "@material-ui/core/IconButton";
import ArrowBackTwoToneIcon from '@material-ui/icons/ArrowBackTwoTone';
import InputAdornment from "@material-ui/core/InputAdornment";
import TollSharpIcon from '@material-ui/icons/TollSharp';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Background from '../../images/vama.jpeg';


class Chat extends Component {

  constructor(props) {
    super(props);
    this.state = {
        contact: '',
    };
  }
  componentWillMount() {
    const contact  = JSON.parse(localStorage.getItem('currentContact'));
    this.setState({
        contact: contact
    });
    console.log(contact);
  }

  renderIcon = () => {
    if(this.state.contact.online === 'false')
      return (
        <div>
        <IconButton>
          <TollSharpIcon style={{ fill:'#e57373' }} />
        </IconButton>
        <a style={{ fontSize:17 }} > offline</a>
        </div>
      );
    return (
      <div>
      <IconButton>
        <TollSharpIcon style={{ fill:'#76ff03' }}/>
      </IconButton>
      <a style={{ fontSize:17 }}> online</a>
      </div>
      );
  }

  render() {
    return (
      <div className="card page" style={{ backgroundImage: `url(${Background})`}}>
        
        <AppBar position="static"style={{ background: '#b39ddb',  position: 'absolute', left: '0%',minHeight: 80, }} subtitle={this.renderIcon()}>
          <Toolbar>
          <IconButton variant="outlined" edge="start" color="action" onClick={() => { 
              localStorage.removeItem('currentContact')
              this.props.history.push('/welcome'); 
              }}>
            <ArrowBackTwoToneIcon/>
          </IconButton>
          <Typography variant="h6" color="inherit" style={{ left:'20%', fontSize:30}}>
            {this.state.contact.first_name} {this.state.contact.last_name}
          </Typography>
          </Toolbar>
          <div style={{ position: 'absolute', left: '10%', top: '50%',  fontSize:0}}>
            {this.renderIcon()}
          </div>
        </AppBar>
        </div >
    );
  }
}

export default Chat;