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
import FilledInput from '@material-ui/core/FilledInput';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import TextField from '@material-ui/core/TextField';
import TelegramIcon from '@material-ui/icons/Telegram';
import ChatMessage from '../chatMessage/ChatMessage'
import ChatLayout from "../chatLayout/ChatLayout";

const URL = 'ws://localhost:3030'


class Chat extends Component {

  constructor(props) {
    super(props);
    this.state = {
        contact: '',
        newMessage: '',
        socket : '',
        messages: [],
    };
    this.ws = new WebSocket(URL)

    
  }
  componentDidMount() {
    this.ws.onopen = () => {
      // on connecting, do nothing but log it to the console
      console.log('connected')
    }

    this.ws.onmessage = evt => {
      // on receiving a message, add it to the list of messages
      let message = JSON.parse(evt.data)
      message.direction = 'left';
      console.log(message)
      this.addMessage(message)
    }

    this.ws.onclose = () => {
      console.log('disconnected')
      // automatically try to reconnect on connection loss
      this.setState({
        ws: new WebSocket(URL),
      })
    }
  }

  addMessage = message =>
    this.setState(state => ({ messages: [...state.messages, message] }))

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

  handleChange = (event) => {
    this.setState({
      newMessage: event.target.value,
  });
  };

  handleClickSend = (e) => {
    e.preventDefault();

    const message = { direction: 'right', message: this.state.newMessage }
    this.ws.send(JSON.stringify(message))
    this.addMessage(message)
    
    this.setState({
      newMessage: ''
    });
  };

  render() {
    return (
      <div className="card page" style={{ backgroundImage: `url(${Background})`}}>
      
        <AppBar position="static"style={{ background: '#b39ddb',  position: 'absolute', left: '0%',minHeight: 80, marginTop : '-32px' }} subtitle={this.renderIcon()}>
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
        {/*
        <div>
        <div style={{width: "100%", height: "100%", border:"2px solid black",borderRadius:"20px"}}>
        {this.state.messages.reverse().map((message, index) =>
        
          <ChatMessage
            key={index}
            message={message.message}
            owner={message.owner}
          />,
        )}
        </div>
        </div>*/}
        <div style={{width:'100%', marginTop:"80px"}}>
        <ChatLayout messages={this.state.messages}/>
        </div>
        <FormControl inline variant="outlined" style={{ flex: 1, justifyContent: 'flex-end', height: '100%',width : '100%', outline: 'none', }}>
         
          <OutlinedInput id="component-outlined" 
                         placeholder="Type a message" 
                         value={this.state.newMessage} 
                         onChange={this.handleChange} 
                         endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              style={{outline : 'none'}}
                              onClick={this.handleClickSend}
                              edge="end"
                            >
                             <TelegramIcon style={{color : 'white' }} />
                             </IconButton>
                          </InputAdornment>
                        }
                         style={{backgroundColor:'rgba(0,0,0,0.5)', color : 'rgba(255,255,255)', outline: 'none', borderRadius:'20px'}}
          />
       
        </FormControl>
        
        </div >
    );
  }
}

export default Chat;