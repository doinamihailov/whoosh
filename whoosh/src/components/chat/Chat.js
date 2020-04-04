import React, { Component } from "react";
import "./Chat.css";
import Title from '../title/Title';



class Chat extends Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <div className="card page">
        <Title title="Chat" class="title-80" variant="h4" align="center" />
        <p>Chat here..</p>
      </div >
    );
  }
}

export default Chat;
