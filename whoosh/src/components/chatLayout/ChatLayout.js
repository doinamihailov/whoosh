import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles(theme => ({
  container: {
    bottom: 0
    // position: "fixed" // remove this so we can apply flex design
  },
  bubbleContainer: {
    width: "100%",
    display: "flex" //new added flex so we can put div at left and right side
    //check style.css for left and right classnaeme based on your data
  },
  bubble: {
    border: "0.5px solid black",
    borderRadius: "20px",
    margin: "5px",
    padding: "10px",
    display: "inline-block",
    backgroundColor:'rgba(0,0,0,0.5)', 
    color : 'rgba(255,255,255)',
  }
}));

const ChatLayout = (props) => {
  const classes = useStyles();
  const dummyData = props.messages;

  const chatBubbles = dummyData.map((obj, i = 0) => (
    <div className={`${classes.bubbleContainer} ${obj.direction}`} key={i}>
      <div key={i++} className={classes.bubble}>
        <div className={classes.button}>{obj.message}</div>
      </div>
    </div>
  ));
  return <div className={classes.container}>{chatBubbles}</div>;
};

export default ChatLayout;
