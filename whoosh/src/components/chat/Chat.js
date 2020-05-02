import React, { Component } from "react";
import Button from '@material-ui/core/Button';
import "./Chat.css";
import Title from '../title/Title';
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import TollSharpIcon from '@material-ui/icons/TollSharp';


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
      <div className="card page">
        <p>{this.state.contact.first_name} {this.state.contact.last_name}</p>
        {this.renderIcon()}
        <br></br>
       <Button variant="outlined" color="primary"onClick={() => { 
           localStorage.removeItem('currentContact')
           this.props.history.push('/welcome'); 
           }}>
        Go back
        </Button>
        </div >
    );
  }
}

export default Chat;