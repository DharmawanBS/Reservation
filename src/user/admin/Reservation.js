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
import moment from 'moment';

//icons
import SaveIcon from '@material-ui/icons/Save';
import CloseIcon from '@material-ui/icons/Close';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import green from '@material-ui/core/colors/green';
import amber from '@material-ui/core/colors/amber';


//var
var date = moment(date).format();
var util = require('util')
//const
const styles = {
	root: {
		padding: 8,
		paddingLeft: 40,
		paddingRight: 40,
		width: '70vw',
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
	button: {
		marginTop: 16,
		marginBottom: 8,
		textAlign: 'right'
	},
	leftIcon: {
		marginRight: 8,
	},
};

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

//class
class Reservation extends Component {
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
			var result = this.state.data.filter(obj => {
				return obj.id === event.target.value
			  })
			  this.setState({
				  raw_price : result[0].price
			  },()=>{
				this._calculatePrice();
			  })
			  
		}
	};

	_calculatePrice=()=>{
		var mult = 1;
		if(this['client_start_date'].value !== '' && this['client_finish_date'].value !== ''){
		let a = this['client_start_date'].value.split('T')[0], b = this['client_finish_date'].value.split('T')[0];
			mult = this.dateDiffInDays(new Date(a),new Date(b));
		}
		this.setState({
			price : this.state.raw_price * mult
		})
	}

	dateDiffInDays(a, b) {
		const _MS_PER_DAY = 1000 * 60 * 60 * 24;
		// Discard the time and time-zone information.
		const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
		const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
	  
		return Math.floor((utc2 - utc1) / _MS_PER_DAY);
	  }

	state = {
		type: '',
		pickup: '',
		destination: '',
		dateNow: date,
		busType: '',
		price: '',
		notes: '',
		name : '',
		data : [],
		submit_success : false,
		loading : false,
		start_date : (date + '').split('+')[0].slice(0,-3),
		end_date : (date + '').split('+')[0].slice(0,-3),
		raw_price : 0
	};

	handleSave = () =>{
		this.setState({
			name : this['client_name'].value,
			type : this['client_type'].value,
			phone : this['client_phone'].value,
			destination : this['client_destination'].value,
			pickup : this['client_pick_up'].value,
			notes : this['client_notes'].value,
		});
		this._buildPayload();
	}

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

	_resetField=()=>{
		this['client_name'].value = '' ;
		this['client_phone'].value = '';
		this['client_destination'].value = '';
		this['client_pick_up'].value ='';
		this['client_start_date'].value ='';
		this['client_finish_date'].value ='';
		this.setState({busType : ''})
		this['client_notes'].value ='';
	}

	_submitPayload=()=>{
		this.setState({
			loading : true
		})
		fetch('http://www.api.jakartabusrent.com/index.php/reservasi/reservasi',{
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
            }
		})
		.catch(e=>console.log(e));
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

	fetchData=()=>{
		fetch('http://www.api.jakartabusrent.com/index.php/Vehicle/read',{
		  method : 'POST'
		}).then(response => response.json())
		.then(responseJSON => {
		  console.log(JSON.stringify(responseJSON.data))
		  let arr = [];
		  if(responseJSON.msg.toLowerCase() === 'ok'){
			this.setState({
			  data : responseJSON.data
			});
		  }
		})
	  }

	componentDidMount(){
		console.log(this.state.start_date);
		this.fetchData();
	}

	dateFormatter=(date)=>{
		return date.replace('T', ' ');
	}

	dateChecker=(when,date)=>{
		let start = moment(this.state.start_date);
		let end = moment(this.state.end_date);
		if(when === 'start'){
			return moment(date).isBefore(end);
		}else if(when === 'end'){
			return moment(date).isAfter(start);
		}
		return start.isBefore(end);
	}

	_buildPayload=()=>{
		var obj ={
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

	render() {
		//const { classes } = props;
		return(
			<div>
				<Paper style={styles.root} elevation={1}>
					<Typography variant="h4" gutterBottom style={styles.title}>New Reservation</Typography>
					<form>
						<TextField
							inputRef = {(input) => this['client_name'] = input}
							label="Client Name"
							fullWidth
							style={[styles.textField, styles.dense]}
							onChange={this.handleChange('name')}
							margin="dense"
							variant="outlined"
							disabled={this.state.loading}
						/>
						<TextField
							disabled={this.state.loading}
							inputRef = {(input) => this['client_type'] = input}
							select
							label="Client Type"
							style={styles.textField}
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
							inputRef = {(input) => this['client_phone'] = input}
							label="Phone"
							fullWidth
							style={[styles.textField, styles.dense]}
							onChange={this.handleChange('phone')}
							margin="dense"
							variant="outlined"
						/>
						<TextField
							disabled={this.state.loading}
							inputRef = {(input) => this['client_destination'] = input}
							label="Destination"
							multiline
							rowsMax="4"
							style={styles.textField}
							margin="normal"
							variant="outlined"
							fullWidth
						/>
						<TextField
							disabled={this.state.loading}
							inputRef = {(input) => this['client_pick_up'] = input}
							label="Pick Up Location"
							multiline
							rowsMax="4"
							style={styles.textField}
							margin="normal"
							variant="outlined"
							fullWidth
						/>
						<TextField
							disabled={this.state.loading}
							inputRef = {(input) => this['client_start_date'] = input}
							value={this.state.start_date}
							onChange={(e)=>{
								if(this.dateChecker('start',e.target.value)){
									this.setState({start_date: e.target.value})
								}else{
									this.setState({
										start_date : e.target.value,
										end_date: e.target.value
									})
								}
								this._calculatePrice();
							}}
							label="Starting Date"
							type="datetime-local"
							style={styles.textField}
							InputLabelProps={{
							shrink: true,
							}}
							fullWidth
						/>
						<TextField
							disabled={this.state.loading}
							label="End Date"
							inputRef = {(input) => this['client_finish_date'] = input}
							value={this.state.end_date}
							onChange={(e)=>{
								if(this.dateChecker('end',e.target.value)){
									this.setState({end_date: e.target.value})
								}else{
									this.setState({
										start_date : e.target.value,
										end_date: e.target.value
									})
								}
								this._calculatePrice();
							}}
							type="datetime-local"
							style={styles.textField}
							InputLabelProps={{
							shrink: true,
							}}
							fullWidth
						/>
						<TextField
							disabled={this.state.loading}
							inputRef = {(input) => this['client_bus_type'] = input}
							select
							label="Bus Type"
							style={styles.textField}
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
							{this.state.data.map(option => (
								<MenuItem key={option.id} value={option.id}>
								{option.type} {option.number}
								</MenuItem>
							))}
						</TextField>
						<TextField
							disabled={this.state.loading}
							inputRef = {(input) => this['client_notes'] = input}
							label="Notes"
							multiline
							rowsMax="4"
							style={styles.textField}
							margin="normal"
							variant="outlined"
							fullWidth
						/>
						<TextField
							disabled={this.state.loading}
							inputRef = {(input) => this['price'] = input}
							style={[styles.dense, styles.textField]}
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
							<Button disabled={this.state.loading} variant="contained" color="primary" style={styles.button} onClick={()=>this._handleSubmitButton()}>
								<SaveIcon style={styles.leftIcon} />
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
			</div>
		)
	}
}

export default withStyles(styles)(Reservation);
