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
const url = 'http://api.jakartabusrent.com/index.php/reservation/print?id=';
class App extends Component {
  state = {
    events: [],
    data : [],
    openDialog : false,
    tempData : {},
    emptyData : false,
    vehicleData : []
  };

  getVehicleDetail=(vehicleId)=>{
    return this.state.vehicleData.findIndex((item)=>item.id === vehicleId)
  }

  _buildEvents=()=>{
    var arr =[];
    var data = this.state.data;
    let len = this.state.data.length;
    for(let x=0; x<len; x++){
      let vehicleId = this.getVehicleDetail(data[x].vehicle);
      let vehicleData = this.state.vehicleData[vehicleId];
      console.log('MY ID : ' + vehicleId);
      arr.push({
        start : new Date(data[x].start),
        end : new Date(data[x].end),
        title : data[x].code,
        id : data[x].id,
        reservation : data[x].client_name + ' from ' + data[x].pick_up_location + ' to ' + data[x].destination,
        vehicle : data[x].vehicle_type + ' ' + data[x].vehicle_number  
      })
    }
    this.setState({events : arr});
  }

  fetchData=()=>{
    this.setState({
			loading : true
		})
		fetch('http://www.api.jakartabusrent.com/index.php/reservation/read',{
            method : 'POST',
            headers: {
                'content-type': 'application/json',
                'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
            },
        }).then(response => response.json())
        .then(responseJSON =>{
          const status = responseJSON.msg.toLowerCase();
            if(status === 'ok'){
                this.setState({
                  data : responseJSON.data
                },()=>this._buildEvents());
                
            }else if(status === 'empty'){
              this.setState({
                emptyData : true
              })
            }
            this.setState({loading:false})
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
          <DialogTitle id="alert-dialog-title">{this.state.tempData.title}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Reservation by {(this.state.tempData.reservation)}<br />
              Start : {(this.state.tempData.start + '').split ('GMT')[0]} <br />
              End : {(this.state.tempData.end + '').split('GMT')[0]} <br />
              Vehicle : {this.state.tempData.vehicle}
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
          onClose={()=>this.setState({loading : false})}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">Loading...</span>}
        />
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          open={this.state.emptyData}
          onClose={()=>this.setState({emptyData : false})}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">No Data</span>}
        />
      </Grid>
    );
  }
}

export default App;