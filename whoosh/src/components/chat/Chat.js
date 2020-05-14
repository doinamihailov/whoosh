import React, { Component } from "react";
import "./Chat.css";

import IconButton from "@material-ui/core/IconButton";
import ArrowBackTwoToneIcon from '@material-ui/icons/ArrowBackTwoTone';
import InputAdornment from "@material-ui/core/InputAdornment";
import TollSharpIcon from '@material-ui/icons/TollSharp';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Background from '../../images/vama.jpeg';
import FormControl from '@material-ui/core/FormControl';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import TelegramIcon from '@material-ui/icons/Telegram';
import ChatLayout from "../chatLayout/ChatLayout";

import { MDBContainer, MDBScrollbar } from "mdbreact";

const URL = 'ws://localhost:3030'


class Chat extends Component {

  constructor(props) {
    super(props);
    this.state = {
        me: '',
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
      const email = localStorage.getItem("currentEmail");
      this.setState ({
        me : email
      });
      this.ws.send(JSON.stringify({'id':email, 'receiver': this.state.contact.email}))
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
    this.setupBeforeUnloadListener();
  }

  doSomethingBeforeUnload = () => {
    this.ws.send(JSON.stringify({'disconnect': true, 'sender': this.state.me, 'receiver': this.state.contact.email}));
  }   

  setupBeforeUnloadListener = () => {
    window.addEventListener("beforeunload", (ev) => {
        ev.preventDefault();
        return this.doSomethingBeforeUnload();
    });
  };

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

    const message = { direction: 'right', message: this.state.newMessage, receiver: this.state.contact.email, sender: this.state.me }
    this.ws.send(JSON.stringify(message))
    this.addMessage(message)
    
    this.setState({
      newMessage: ''
    });
  };

  render() {
    return (
      <div className="card page" style={{ backgroundImage: `url(${Background})`, top:0, position:'fixed', height:'100%',  marginTop : '60px' }}>
      
        <AppBar position="static"style={{ background: '#b39ddb',  position: 'absolute', left: '0%',minHeight: 80, marginTop : '-30px'}} subtitle={this.renderIcon()}>
          <Toolbar>
          <IconButton variant="outlined" edge="start" color="action" onClick={() => { 
              this.doSomethingBeforeUnload();
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
        <MDBContainer>
        <div style={{width:'95%', height:'auto',  flex: 1, justifyContent: 'flex-end', position: 'absolute', bottom: 0, marginBottom:"120px", marginLeft: "-20px"}}>
        <ChatLayout messages={this.state.messages}/>
        </div>
        </MDBContainer>
        <FormControl inline variant="outlined" style={{ flex: 1, justifyContent: 'flex-end', height: '100%',width : '60%', outline: 'none', bottom: 0, position : 'fixed'}}>
         
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