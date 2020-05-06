import React, { Component} from 'react';
import './Slider.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Logo from "./4809.jpg";
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import AppBar from '@material-ui/core/AppBar';
import Whoosh from "./ww2.PNG";
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { positions } from '@material-ui/system';
import { makeStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import KeyboardVoiceIcon from '@material-ui/icons/KeyboardVoice';
import Icon from '@material-ui/core/Icon';
import SaveIcon from '@material-ui/icons/Save';


class Slider extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
        }
    }
    
    render(){
        const { classes } = this.props;
        return(
            <div className = "background">
                <AppBar position="fixed" className="appbar" color='transparent'>
                <Toolbar>
                  <Typography variant="h6" className="titlu" color='primary'>
                    <Link to="/slider" className="link">
                    <img src={Whoosh}  width="170" height="80"/>
                    </Link>
                  </Typography>

                <Grid justify="flex-end"
                    container 
                    spacing={24}>
                    <Grid item>
                    <Button variant="outlined" href="/login">GET STARTED</Button>
                    </Grid>
                </Grid>
                </Toolbar>
              </AppBar>

            <img src={Logo}  width="1500" height="650" alt="first try" />
            </div>
        );
    }
}
export default Slider;