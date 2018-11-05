import React, { Component } from "react";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import {Route} from 'react-router-dom';

import Check from './Check';
import Available from './Available';
import BookingDetail from './BookingDetail';
import { Grid } from "@material-ui/core";

var date = new Date();

const styles = {
	root: {
		padding: 8,
		paddingLeft: 40,
		paddingRight: 40,
		width: '70vw'
	},
	textField: {
		//marginLeft: 8,
		//marginRight: 8,
		marginTop: 16,
		marginBottom: 16
	},
	dense: {
		marginTop: 19,
	},
	container: {
		display: 'flex',
		flexWrap: 'wrap',
	},
	title: {
		textAlign: 'center'
	},
	formControl: {
		minWidth: '100%',
		marginBottom: 8,
		marginTop: 8
	},
	selectEmpty: {
		marginTop: 16,
	},
};

const bus_types = [
	{
	  value: 'type-a',
	  label: 'Bus Type A',
	},
	{
	  value: 'type-b',
	  label: 'Bus Type B',
	},
	{
	  value: 'type-c',
	  label: 'Bus Type C',
	},
];

class LandingPage extends Component {
    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };

    state = {
		title : "Book"
	};
  //update Title every page
  componentWillUpdate(nextProps, nextState) {
    var path = nextProps.location.pathname;
    if ( path === '/user') {
      nextState.title = 'Book';
    }
    else {
      var title = path.replace('/user/','');
      nextState.title = title.charAt(0).toUpperCase() + title.slice(1);
    }
    
  }
  render() {
    return (
    <div style={{flex:1, justifyContent:'center', alignItems:'center',alignContent:'center', position:'relative'}}>
        <div style={{
            backgroundImage:"url('http://www.jakartabusrent.com/lampiran/home2.jpg')",
            backgroundRepeat:false,
            height: '100vh',
            objectFit:'cover'
        }}
        >
        <div style={{
            minHeight: '100%',
            backgroundRepeat:false,
            height: '100vh',
            background: 'linear-gradient(to right bottom,rgba(0,0,0,0.8),rgba(0,0,0,0.8))',
        }}>
            <AppBar position="sticky" style={{ background: 'transparent'}} elevation={0}>
            <Toolbar>
            <Typography variant="h6" color="inherit">
                Jakarta Bus Rent || {this.state.title}
            </Typography>
            </Toolbar>
        </AppBar>
        </div>
        <Grid container style={{flex:1, position:'absolute', top:0, left:0, right:0, bottom:0}}>
            <Route exact path='/user' component={Check}></Route>
            <Route exact path='/user/available' component={Available}></Route>
            <Route exact path='/user/booking detail' component={BookingDetail}></Route>
        </Grid>
        </div>
      </div>
    );
  }
}

export default LandingPage;