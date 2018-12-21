import React, { Component } from "react";
import Calendar from "react-big-calendar";
import moment from "moment";
import "../../App.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';

const localizer = Calendar.momentLocalizer(moment);
const url = 'http://api.jakartabusrent.com/index.php/reservasi/print?id=';
class App extends Component {
  state = {
    events: [],
    data : [],
    openDialog : false,
    tempData : {}
  };

  _buildEvents=()=>{
    var arr =[];
    var data = this.state.data;
    let len = this.state.data.length;
    for(let x=0; x<len; x++){
      arr.push({
        start : new Date(data[x].start),
        end : new Date(data[x].end),
        title : data[x].type + ' ' + data[x].number + ' to ' + data[x].destination + ' by ' + data[x].name,
        id : data[x].id,
        booking : data[x].booking  
      })
    }
    this.setState({events : arr});
  }

  fetchData=()=>{
    this.setState({
			loading : true
		})
		fetch('http://www.api.jakartabusrent.com/index.php/reservasi/read',{
            method : 'POST',
            headers: {
                'content-type': 'application/json',
                'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
            },
        }).then(response => response.json())
        .then(responseJSON =>{
            if(responseJSON.msg.toLowerCase() === 'ok'){
                this.setState({
                  loading : false,
                  data : responseJSON.data
                },()=>this._buildEvents());
                
            }
		})
		.catch(e=>console.log(e));
  }

  componentDidMount(){
    this.fetchData();
  }

  _handleClick=(event)=>{
    this.setState({
      tempData : event,
      openDialog : true
    })
    console.log(event);
  }

  _showString=(str)=>{
    var date = new Date(str),
        mnth = ("0" + (date.getMonth()+1)).slice(-2),
        day  = ("0" + date.getDate()).slice(-2);
    return [ date.getFullYear(), mnth, day ].join("-");
  }

  _openNewTab=()=>{
    var win = window.open(url+this.state.tempData.id, '_blank');
    win.focus();
  }

  render() {
    return (
      <Grid justify='center' alignItems='center' style={{flex:1}}>
        <Paper style={{margin:8, padding:16}}>
          <Calendar
            onSelectEvent={(event)=>this._handleClick(event)}
            localizer={localizer}
            defaultDate={new Date()}
            defaultView="month"
            showMultiDayTimes={true}
            events={this.state.events}
            style={{ height: "80vh" }}
          />
        </Paper>
        <Dialog
          open={this.state.openDialog}
          onClose={()=>this.setState({
            openDialog : false
          })}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{this.state.tempData.booking}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Reservation {(this.state.tempData.title)}<br></br>
              Start : {(this.state.tempData.start + '').split ('GMT')[0]} <br></br>
              End : {(this.state.tempData.end + '').split('GMT')[0]}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={()=>this._openNewTab()} color="primary">
              Print
            </Button>
          </DialogActions>
        </Dialog>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          open={this.state.loading}
          autoHideDuration={6000}
          onClose={this.handleClose}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">Loading...</span>}
        />
      </Grid>
    );
  }
}

export default App;