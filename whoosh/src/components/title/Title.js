import React, { Component } from 'react';

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import './Title.css';

class Title extends Component {

    render() {
        return (
            <Grid
                container
                spacing={2}
                className={this.props.class}
                alignItems="center"
                justify="center"
            >
                <Grid item md={12} >
                    <Typography align={this.props.align} variant={this.props.variant}>
                        {this.props.title}
                    </Typography>
                </Grid>
            </Grid>

        )
    }
}


export default Title;