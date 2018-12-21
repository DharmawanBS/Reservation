//core
import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import InputAdornment from '@material-ui/core/InputAdornment';
import Button from '@material-ui/core/Button';
import Cookies from 'universal-cookie';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import moment from 'moment';

//icons
import SaveIcon from '@material-ui/icons/Save';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import green from '@material-ui/core/colors/green';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import ArrowBack from '@material-ui/icons/ArrowBack';
import { Grid } from '@material-ui/core';

//var
var date = moment(date).format();
//const
const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
        padding: theme.spacing.unit * 3,
    },
    rightIcon: {
        marginLeft: theme.spacing.unit,
    },
    textField: {
        marginTop: theme.spacing.unit,
        marginBottom: theme.spacing.unit
    },
	title: {
		textAlign: 'center'
	},
    dense: {
        marginTop: theme.spacing.unit,
    },
    addButtonBottom: {
        position: 'fixed',
        bottom: '1vh',
        right: '2vw'
    },
    addButtonBottom2: {
        position: 'fixed',
        bottom: '1vh',
    },
    divRoot: {
        paddingBottom: '5vh',
    },
    button: {
        marginRight: theme.spacing.unit,
    },
    leftIcon: {
        marginRight: theme.spacing.unit,
    }
});

const types = [
	{
	  value: 'type-a',
	  label: 'Type A',
	},
	{
	  value: 'type-b',
	  label: 'Type B',
	},
	{
	  value: 'type-c',
	  label: 'Type C',
	},
];

const cookie = new Cookies();

//class for update user data
class UpdateOrder extends Component {
	handleChangeTextbox = name => event => {
		this.setState({
		  [name]: event.target.value,
		});
	  };

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
        if(name === 'busType'){
            var result = this.state.vehicleData.filter(obj => {
                return obj.id === event.target.value
                })
                var mult = 1;
                if(this['client_start_date'].value !== '' && this['client_finish_date'].value !== ''){
                let a = this['client_start_date'].value.split('T')[0], b = this['client_finish_date'].value.split('T')[0];
                    mult = this.dateDiffInDays(new Date(a),new Date(b));
                }
                this.setState({
                    price : result[0].price * mult
                })
        }
	};

	dateDiffInDays(a, b) {
		const _MS_PER_DAY = 1000 * 60 * 60 * 24;
		// Discard the time and time-zone information.
		const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
		const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
	  
		return Math.floor((utc2 - utc1) / _MS_PER_DAY);
	  }

	state = {
        data : [],
        vehicleData: [],
        userVehicleData: [],
		submit_success : false,
        loading : true,
        busTypes: '',
        id: '',
        idVehicle: '',
        type: '',
		pickup: '',
		destination: '',
		dateNow: date,
		price: '',
		notes: '',
		name : '',
		start_date : (date + '').split('+')[0].slice(0,-3),
		end_date : (date + '').split('+')[0].slice(0,-3),
	};

    handleBackButton = () => {
        this.props.history.push({
            pathname : '/admin/orders',
          });
    };

    _emptyChecker=()=>{
		var empty = false;
		switch(true){
			case this['client_name'].value === '' :
			case this['client_phone'].value === '':
			case this['client_destination'].value === '':
			case this['client_pick_up'].value === '':
			case this['client_start_date'].value === '':
			case this['client_finish_date'].value === '':
			case this.state.busType === '':
			case this['client_notes'].value === '':
			return true;
			default : return false;
		}
	}

	_handleSubmitButton=()=>{
		if(!this._emptyChecker()){
			if(window.confirm("Submit this data?")){
				this._submitPayload();
			}
		}else{
			window.alert('Form cannot be empty, please check again');
		}
		
    }

    _submitPayload=()=>{
		this.setState({
			loading : true
		})
		fetch('http://www.api.jakartabusrent.com/index.php/reservasi/update',{
            method : 'POST',
            headers: {
                'content-type': 'application/json',
                'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
            },
            body : this._buildPayload()
        }).then(response => response.json())
        .then(responseJSON =>{
            if(responseJSON.msg.toLowerCase() === 'ok'){
                this.setState({
					submit_success : true,
					loading : false
                });
                setTimeout(
                    this.handleBackButton(),
                    1000
                )
            }
		})
		.catch(e=>console.log(e));
	}
    
	_buildPayload=()=>{
		var obj ={
            id : this.state.id,
			user : cookie.get('user_id'),
			name : this['client_name'].value,
			phone : this['client_phone'].value,
			destination : this['client_destination'].value,
			pick_up_location : this['client_pick_up'].value,
			start : this.dateFormatter(this.state.start_date),
			end : this.dateFormatter(this.state.end_date),
			vehicle : this.state.busType,
			notes : this['client_notes'].value,
		}
		console.log(JSON.stringify(obj));
		return JSON.stringify(obj);
    }
    
    
	dateFormatter=(date)=>{
		return date.replace('T', ' ');
	}

	dateChecker=()=>{
		let start = moment(this.state.start_date);
		let end = moment(this.state.end_date);
		return start.isBefore(end);
	}

    fetchData=(id)=>{
       fetch('http://www.api.jakartabusrent.com/index.php/Vehicle/read',{
          method : 'POST',
          headers: {
            'content-type': 'application/json',
            'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
        }
		}).then(response => response.json())
		.then(responseJSON => {
		  console.log(JSON.stringify(responseJSON.data))
		  let arr = [];
		  if(responseJSON.msg.toLowerCase() === 'ok'){
			this.setState({
			  vehicleData : responseJSON.data
            });
		  }
        })
        fetch('http://www.api.jakartabusrent.com/index.php/reservasi/read',{
        method : 'POST',
        headers: {
            'content-type': 'application/json',
            'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
        },
        body : JSON.stringify({id: id})
            }).then(response => response.json())
            .then(responseJSON => {
            console.log(JSON.stringify(responseJSON.data))
            let arr = [];
            if(responseJSON.msg.toLowerCase() === 'ok'){
                this.setState({
                    data : responseJSON.data[0],
                    idVehicle : responseJSON.data[0].vehicle,
                });
            }
        });
        fetch('http://www.api.jakartabusrent.com/index.php/Vehicle/read',{
        method : 'POST',
        headers: {
            'content-type': 'application/json',
            'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
        },
        body : JSON.stringify({id: this.state.idVehicle})
            }).then(response => response.json())
            .then(responseJSON => {
            console.log(JSON.stringify(responseJSON.data))
            let arr = [];
            if(responseJSON.msg.toLowerCase() === 'ok'){
                this.setState({
                    userVehicleData : responseJSON.data[0],
                    loading : false
                });
            }
        });
        
    }
    
    componentDidMount(){
        const { match: { params } } = this.props;
        this.fetchData(params.id);
        this.setState({id: params.id});
    }

	render() {
        const { classes } = this.props;
		if (this.state.loading) {
            return (
                <Grid container justify='center' alignItems='center' style={{flex:1, height:'80vh', padding:16}}>
                  <CircularProgress size={100} style={{alignSelf:'center'}}/>
                </Grid>
              )
        } else {
            return(
                <Grid className={classes.divRoot} xl={8} xs={12} sm={10} md={10} lg={8}>
                    <Paper className={classes.root} elevation={1}>
                        <Typography variant="h4" gutterBottom className={classes.title}>Edit Reservation</Typography>
                        <form>
                            <TextField
                                inputRef = {(input) => this['client_name'] = input}
                                label="Client Name"
                                defaultValue={this.state.data.name}
                                fullWidth
                                className={[classes.textField, classes.dense]}
                                onChange={this.handleChange('name')}
                                margin="dense"
                                variant="outlined"
                                disabled={this.state.loading}
                            />
                            <TextField
                                disabled={this.state.loading}
                                inputRef = {(input) => this['client_type'] = input}
                                defaultValue={this.state.data.type}
                                select
                                label="Client Type"
                                className={classes.textField}
                                value={this.state.type}
                                onChange={this.handleChange('type')}
                                SelectProps={{
                                    MenuProps: {
                                    
                                    },
                                }}
                                margin="normal"
                                variant="outlined"
                                fullWidth
                            >
                                {types.map(option => (
                                    <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                disabled={this.state.loading}
                                defaultValue={this.state.data.phone}
                                inputRef = {(input) => this['client_phone'] = input}
                                label="Phone"
                                fullWidth
                                className={[classes.textField, classes.dense]}
                                onChange={this.handleChange('phone')}
                                margin="dense"
                                variant="outlined"
                            />
                            <TextField
                                disabled={this.state.loading}
                                defaultValue={this.state.data.destination}
                                inputRef = {(input) => this['client_destination'] = input}
                                label="Destination"
                                multiline
                                rowsMax="4"
                                className={classes.textField}
                                margin="normal"
                                variant="outlined"
                                fullWidth
                            />
                            <TextField
                                disabled={this.state.loading}
                                defaultValue={this.state.data.pick_up_location}
                                inputRef = {(input) => this['client_pick_up'] = input}
                                label="Pick Up Location"
                                multiline
                                rowsMax="4"
                                className={classes.textField}
                                margin="normal"
                                variant="outlined"
                                fullWidth
                            />
                            <TextField
                                disabled={this.state.loading}
                                defaultValue={moment(this.state.data.start).format()}
                                inputRef = {(input) => this['client_start_date'] = input}
                                value={this.state.start_date}
                                onChange={(e)=>{
                                    this.setState({start_date : e.target.value},()=>{
                                        if(!this.dateChecker()){
                                        this.setState({end_date : this.state.start_date})
                                    }
                                    })
                                }}
                                label="Starting Date"
                                type="datetime-local"
                                className={classes.textField}
                                InputLabelProps={{
                                shrink: true,
                                }}
                                fullWidth
                            />
                            <TextField
                                disabled={this.state.loading}
                                defaultValue={moment(this.state.data.end).format()}
                                label="End Date"
                                inputRef = {(input) => this['client_finish_date'] = input}
                                value={this.state.end_date}
                                onChange={(e)=>{
                                    this.setState({end_date : e.target.value},()=>{
                                        if(!this.dateChecker()){
                                        this.setState({start_date: this.state.end_date})
                                    }
                                    })
                                }}
                                type="datetime-local"
                                className={classes.textField}
                                InputLabelProps={{
                                shrink: true,
                                }}
                                fullWidth
                            />
                            <TextField
                                disabled={this.state.loading}
                                defaultValue={this.state.userVehicleData.id}
                                inputRef = {(input) => this['client_bus_type'] = input}
                                select
                                label="Bus Type"
                                className={classes.textField}
                                value={this.state.busType}
                                onChange={this.handleChange('busType')}
                                SelectProps={{
                                    MenuProps: {
                                    
                                    },
                                }}
                                margin="normal"
                                variant="outlined"
                                fullWidth
                            >
                                {this.state.vehicleData.map(option => (
                                    <MenuItem key={option.id} value={option.id}>
                                    {option.type} {option.number}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                disabled={this.state.loading}
                                defaultValue={this.state.data.notes}
                                inputRef = {(input) => this['client_notes'] = input}
                                label="Notes"
                                multiline
                                rowsMax="4"
                                className={classes.textField}
                                margin="normal"
                                variant="outlined"
                                fullWidth
                            />
                            <TextField
                                disabled={this.state.loading}
                                defaultValue={this.state.data.price}
                                inputRef = {(input) => this['price'] = input}
                                className={[classes.dense, classes.textField]}
                                variant="outlined"
                                label="Price"
                                value={this.state.price}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">IDR</InputAdornment>,
                                }}
                                fullWidth
                                type='Number'
                            />
                            <div style={{textAlign: 'right'}}>
                                <Button disabled={this.state.loading} variant="contained" color="secondary" className={classes.button} onClick={()=>this.handleBackButton()}>
                                    <ArrowBack className={classes.leftIcon} />
                                    Back Without Saving
                                </Button>
                                <Button disabled={this.state.loading} variant="contained" color="primary" className={classes.button} onClick={()=>this._handleSubmitButton()}>
                                    <SaveIcon className={classes.leftIcon} />
                                    Save
                                </Button>
                            </div>
                        </form>
                        <Snackbar
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        open={this.state.submit_success}
                        autoHideDuration={6000}
                        onClose={()=>this.setState({submit_success:false})}
                        ContentProps={{
                            'aria-describedby': 'message-id',
                        }}
                        >
                            <SnackbarContent
                            aria-describedby="client-snackbar"
                            style={{backgroundColor:green[600]}}
                            message={
                                <span id="client-snackbar" style={{display: 'flex',alignItems: 'center',}}>
                                <CheckCircleIcon style={{fontSize:20, opacity:0.9, marginRight:8}}/>
                                Saved successfully
                                </span>
                            }
                            />
                        </Snackbar>
                    </Paper>
                </Grid>
            )
        }
	}
}

export default withStyles(styles)(UpdateOrder);