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
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';

const localizer = Calendar.momentLocalizer(moment);
const url = 'http://api.jakartabusrent.com/index.php/reservation/print?id=';
class App extends Component {
  state = {
    events: [],
    data : [],
    openDialog : false,
    tempData : {crew:[]},
    emptyData : false,
    vehicleData : [],
    anchorEl: null,
    selectedIndex: 0,
    allVehicle : [],
    vehicleList : [],
    allEvents : []
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
        start : data[x].start,
        end : data[x].end,
        title : data[x].code,
        id : data[x].id,
        reservation : data[x].client_name ,
        pick_up : data[x].pick_up_location,
        destination : data[x].destination,
        vehicle : data[x].vehicle_type + ' ' + data[x].vehicle_number,
        crew : data[x].crew,
        client_phone : data[x].client_phone,
        price : data[x].price,
        notes : data[x].notes  
      })
    }
    this.setState({events : arr, allEvents : arr});
  }

  fetchVehicle=()=>{
    fetch('http://www.api.jakartabusrent.com/index.php/Vehicle/read',{
      method : 'POST'
    }).then(response => response.json())
    .then(responseJSON => {
      console.log(JSON.stringify(responseJSON.data))
      let arr = [];
      if(responseJSON.msg.toLowerCase() === 'ok'){
        this.setState({
          allVehicle : responseJSON.data,
        });
        let vehicleList = [];
        for(let x=0;x<responseJSON.data.length;x++){
          vehicleList.push(responseJSON.data[x].type + ' ' + responseJSON.data[x].number);
        }
        this.setState({
          loading : false,
          vehicleList
        })
      }
    })
  }

  fetchData=()=>{
    this.setState({
			loading : true
    })
    let payload = {};
    payload.is_approved = true;
		fetch('http://www.api.jakartabusrent.com/index.php/reservation/read',{
            method : 'POST',
            headers: {
                'content-type': 'application/json',
                'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
            },
            body : JSON.stringify(payload)
        }).then(response => response.json())
        .then(responseJSON =>{
          const status = responseJSON.msg.toLowerCase();
            if(status === 'ok'){
                this.setState({
                  data : responseJSON.data,
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
    this.fetchVehicle();
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
  handleClickListItem = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleMenuItemClick = (event, index, options) => {
    this.setState({events:[]})
    let allEvents = this.state.allEvents;
    let filtered = allEvents.filter((item)=>(item.vehicle === options[index]));
    if(index === 0)this.setState({ selectedIndex: index, anchorEl: null , events : this.state.allEvents});
    else this.setState({ selectedIndex: index, anchorEl: null , events : filtered});
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const options = [
      'All Vehicle', ...this.state.vehicleList
    ];
    const { anchorEl } = this.state;
    return (
      <Grid justify='center' alignItems='center' style={{flex:1}}>
        <Paper style={{margin:8, padding:16}}>
        <List component="nav">
          <ListItem
            button
            aria-haspopup="true"
            aria-controls="lock-menu"
            aria-label="When device is locked"
            onClick={this.handleClickListItem}
          >
            <ListItemText
              primary="Show : "
              secondary={options[this.state.selectedIndex]}
            />
          </ListItem>
        </List>
        <Menu
          id="lock-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
        >
          {options.map((option, index) => (
            <MenuItem
              key={option}
              selected={index === this.state.selectedIndex}
              onClick={event => this.handleMenuItemClick(event, index,options)}
            >
              {option}
            </MenuItem>
          ))}
        </Menu>
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
          <DialogContent style={{minWidth: '30vw'}}>
            <List id="alert-dialog-description">
              <ListItem>
                <ListItemText style={{textTransform: 'capitalize'}} primary="Client Name" secondary={this.state.tempData.reservation} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Client Phone Number" secondary={this.state.tempData.client_phone} />
              </ListItem>
              <ListItem>
                <ListItemText style={{textTransform: 'capitalize'}} primary="Destination" secondary={this.state.tempData.destination} />
              </ListItem>
              <ListItem>
                <ListItemText style={{textTransform: 'capitalize'}} primary="Pickup Location" secondary={this.state.tempData.pick_up} />
              </ListItem>
              <ListItem>
                <ListItemText style={{textTransform: 'capitalize'}} primary="Notes" secondary={this.state.tempData.notes} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Vehicle" secondary={this.state.tempData.vehicle} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Start Date" secondary={this.state.tempData.start} />
              </ListItem>
              <ListItem>
                <ListItemText primary="End Date" secondary={this.state.tempData.end} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Price" secondary={'IDR '+this.state.tempData.price} />
              </ListItem>
              {
                this.state.tempData.crew.map((item)=>(
                  <ListItem>
                    <ListItemText primary={item.crew_status} secondary={item.crew_name}/>
                  </ListItem>
                ))
              }
            </List>
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