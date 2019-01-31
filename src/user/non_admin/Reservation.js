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
import Grid from '@material-ui/core/Grid';
import moment from 'moment';
import Autosuggest from 'react-autosuggest';
import Popper from '@material-ui/core/Popper';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepButton from '@material-ui/core/StepButton';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

//icons
import SaveIcon from '@material-ui/icons/Save';
import BackIcon from '@material-ui/icons/ArrowLeft';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import NextIcon from '@material-ui/icons/ArrowRight';
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

const steps = ['Customer Data', 'Reservation Data', 'Bus','Overview'];

const cookie = new Cookies();
// Imagine you have a list of languages that you'd like to autosuggest.
 
  // Teach Autosuggest how to calculate suggestions for any given input value.
  const getSuggestions = (value, all) => {
	const inputValue = value.trim().toLowerCase();
	const inputLength = inputValue.length;
  
	return inputLength === 0 ? [] : all.filter(lang =>
	  lang.name.toLowerCase().slice(0, inputLength) === inputValue
	);
  };
  
  // When suggestion is clicked, Autosuggest needs to populate the input
  // based on the clicked suggestion. Teach Autosuggest how to calculate the
  // input value for every given suggestion.
  const getSuggestionValue = suggestion => suggestion.name;
  
  // Use your imagination to render suggestions.
  const renderSuggestion = suggestion => (
	<MenuItem component="div">
	  	{suggestion.name}
    </MenuItem>
  );
  
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
					raw_price : result[0].price,
					selectedVehicle : result[0]
			  })
		}
	};

	_calculatePrice=()=>{
		var mult = 1;
		if(this.state.start_date !== '' && this.state.end_date !== ''){
		let a = moment(this.state.start_date), b = moment(this.state.end_date);
			mult = b.diff(a, 'days');
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
		price: 0,
		notes: '',
		name : '',
		clientPhone : '',
		data : [],
		submit_success : false,
		loading : false,
		start_date : (date + '').split('+')[0].slice(0,-3),
		end_date : (date + '').split('+')[0].slice(0,-3),
		raw_price : 0,
		crewList : [""],
		value: '',
		suggestions: [],
		users : [],
		userTypes : [],
		createNewUser : false,
		activeStep : 0,
		crew : [],
		selectedVehicle : {feature:[]},
		dpMethod : '',
		fullMethod : '',
		dpValue : '',
		fpValue : ''
	};

	handleSave = () =>{
		this.setState({
			name : this.state.value,
			type : this['client_type'].value,
			phone : this.state.clientPhone,
			destination : this.state.destination,
			pickup : this.state.pickup,
			notes : this.state.notes,
		});
		this._buildPayload();
	}

	_emptyChecker=()=>{
		var empty = false;
		switch(true){
			case this.state.value === '' :
			case this.state.clientPhone === '':
			case this.state.destination === '':
			case this.state.pickup === '':
			case this.state.start_date === '':
			case this.state.end_date === '':
			case this.state.busType === '':
			return true;
			default : return false;
		}
	}

	_submitPayload=()=>{
		this.setState({
			loading : true
		})
		fetch('http://www.api.jakartabusrent.com/index.php/reservation/reservation',{
            method : 'POST',
            headers: {
                'content-type': 'application/json',
                'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
            },
            body : this._buildPayload()
        }).then(response => response.json())
        .then(responseJSON =>{
			this.setState({loading : false});
            if(responseJSON.msg.toLowerCase() === 'ok'){
                this.setState({
					submit_success : true,
				},()=>{setTimeout(()=>{
					window.location.reload();
				}, 1000)});
            }else if(responseJSON.msg.toLowerCase() === 'failed' || responseJSON.msg.toLowerCase() === 'invalid'){
				window.alert('Something went wrong, please try again');
				window.location.reload();
			}
		})
		.catch(e=>console.log(e));
	}

	_handleSubmitButton=()=>{
		if(!this._emptyChecker()){
			if(window.confirm("Submit this data?")){
				this._submitPayload();
				//this._buildPayload();
			}
		}else{
			window.alert('Form cannot be empty, please check again');
		}
		
	}

	fetchVehicleData=()=>{
		this.setState({data : []})
		let payload = {};
		let start = this.dateFormatter(this.state.start_date.split(' ')[0]);
		let end = this.dateFormatter(this.state.end_date.split(' ')[0]);
		payload.date_start = start;
		payload.date_end = end;
		payload.is_free = true;
		console.log("Vehicle : " + JSON.stringify(payload))
		fetch('http://www.api.jakartabusrent.com/index.php/Vehicle/read',{
			method : 'POST',
			headers: {
                'content-type': 'application/json',
                'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
            },
			body : JSON.stringify(payload)
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

	  fetchUsers=()=>{
		fetch('http://www.api.jakartabusrent.com/index.php/User/read',{
		  method : 'POST'
		}).then(response => response.json())
		.then(responseJSON => {
		  console.log(JSON.stringify(responseJSON.data))
		  if(responseJSON.msg.toLowerCase() === 'ok'){
			this.setState({
			  users : responseJSON.data
			});
		  }
		})
		}
		
		fetchUserTypes=()=>{
			fetch('http://www.api.jakartabusrent.com/index.php/User_type/read',{
		  method : 'POST'
		}).then(response => response.json())
		.then(responseJSON => {
		  console.log(JSON.stringify(responseJSON.data))
		  if(responseJSON.msg.toLowerCase() === 'ok'){
			this.setState({
			  userTypes : responseJSON.data
			});
		  }
		})
		}

	componentDidMount(){
		console.log(this.state.start_date);
		this.fetchUsers();
		this.fetchUserTypes();
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

	spanNewCrew=()=>{
		let crewList = [...this.state.crewList];
		crewList.push('');
		this.setState({crewList});
	}

	buildCrewList(){
		let len = this.state.crewList.length;
		let crewList = [];
		for(let x=0; x<len; x++){
			let name = this['crewName'+x].value;
			let status = this['crewPosition'+x].value;
			crewList.push({name,status});
		}
		console.log(JSON.stringify(crewList))
		return crewList;
	}

	_buildPayload=()=>{
		let type = '';
		if(this.state.dpValue === this.state.value) type = 'pelunasan'
		else type = 'dp'
		let obj ={
			client_name : this.state.value,
			client_phone : this.state.clientPhone,
			destination : this.state.destination,
			pick_up_location : this.state.pickup,
			start : this.dateFormatter(this.state.start_date),
			end : this.dateFormatter(this.state.end_date),
			vehicle : this.state.busType,
			notes : this.state.notes,
		}
		console.log(JSON.stringify(obj));
		return JSON.stringify(obj);
	}

	onChange = (event, { newValue }) => {
		this.setState({
		  value: newValue
		});
	  };
	
	  // Autosuggest will call this function every time you need to update suggestions.
	  // You already implemented this logic above, so just use it.
	  onSuggestionsFetchRequested = ({ value }) => {
		this.setState({
		  suggestions: getSuggestions(value, this.state.users)
		});
	  };
	
	  // Autosuggest will call this function every time you need to clear suggestions.
	  onSuggestionsClearRequested = () => {
		this.setState({
		  suggestions: []
		});
		};
		
		shouldNextActive=()=>{
			const now = this.state.activeStep;
			switch(now){
				default : return false;
				case 0 : 
					return !(Boolean(this.state.value) && Boolean(this.state.clientPhone));
				case 1 :
					return !(Boolean(this.state.destination) && Boolean(this.state.pickup));
				case 2 :
					return !(Boolean(this.state.busType));
			}
		}
	
	  renderInputComponent(inputProps){
		const { inputRef = () => {}, ref, ...other } = inputProps;
		return (
			<TextField
			  fullWidth
			  InputProps={{
				inputRef: node => {
				  ref(node);
				  inputRef(node);
				}
			  }}
			  label='Client Name'
			  style={styles.textField}
			  disabled={this.state.loading}
			  margin="normal"
			  variant="outlined"
			  {...other}
			/>
		  );
		}
	
		renderUserTypeField(){
			if(this.state.createNewUser){
				return (
					<TextField
						disabled={this.state.loading}
						inputRef = {(input) => this['client_type'] = input}
						select
						label="Client Type"
						style={styles.textField}
						value={this.state.type}
						onChange={this.handleChange('type')}
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
				);
			}
		}

		renderFirstStep=(suggestions,inputProps)=>{
			return (
				<div>
					<Autosuggest
						renderInputComponent = {(inputProps) => this.renderInputComponent(inputProps)}
						suggestions={suggestions}
						onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
						onSuggestionsClearRequested={this.onSuggestionsClearRequested}
						getSuggestionValue={getSuggestionValue}
						renderSuggestion={renderSuggestion}
						inputProps={inputProps}
						theme={{
							suggestionsList: {
							margin: 0,
							padding: 0,
							listStyleType: 'none',
						},
							suggestion: {
							display: 'block',
						},
						}}
						renderSuggestionsContainer={options => (
							<Popper anchorEl={this.popperNode} open={Boolean(options.children)}>
							<Paper
								square
								{...options.containerProps}
								style={{ width: this.popperNode ? this.popperNode.clientWidth : null }}
							>
								{options.children}
							</Paper>
							</Popper>
						)}
					/>
						{this.renderUserTypeField()}
						<TextField
							disabled={this.state.loading}
							value={this.state.clientPhone}
							label="Phone"
							fullWidth
							style={[styles.textField, styles.dense]}
							onChange={(e)=>{this.setState({clientPhone : e.target.value})}}
							margin="dense"
							variant="outlined"
						/>
				</div>
			);
		}

		getDateDiff(){
			const start = moment(this.state.start_date);
			const end = moment(this.state.end_date);
			const diff = end.diff(start,'days');
			return diff;
		}

		renderSecondStep=()=>{
			return (
				<div>
					<TextField
						disabled={this.state.loading}
						value={this.state.destination}
						onChange={(e)=>this.setState({destination : e.target.value})}
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
						value={this.state.pickup}
						onChange={(e)=>this.setState({pickup : e.target.value})}
						label="Pick Up Location"
						multiline
						rowsMax="4"
						style={styles.textField}
						margin="normal"
						variant="outlined"
						fullWidth
					/>
					<Grid container>
						<Grid item style={{flex:1}}>
							<TextField
								disabled={this.state.loading}
								value={this.state.start_date}
								onChange={(e)=>{
									if(this.dateChecker('start',e.target.value)){
										this.setState({start_date: e.target.value}, ()=>this.fetchVehicleData())
									}else{
										this.setState({
											start_date : e.target.value,
											end_date: e.target.value
										}, ()=>this.fetchVehicleData())
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
								value={this.state.end_date}
								onChange={(e)=>{
									if(this.dateChecker('end',e.target.value)){
										this.setState({end_date: e.target.value}, ()=>this.fetchVehicleData())
									}else{
										this.setState({
											start_date : e.target.value,
											end_date: e.target.value
										}, ()=>this.fetchVehicleData())
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
						</Grid>
						<Grid item style={{display:'flex',flex:0.2, textAlign:'center'}} justify='center' alignContent='center' alignItems='center'>
								<Typography variant='h6' style={{padding:16}}>
									{this.getDateDiff()} day(s)
								</Typography>
						</Grid>
					</Grid>
				</div>
			);
		}

		renderThirdStep=()=>{
			return(
				<div>
						<List>
							<ListSubheader>Duration :  {this.getDateDiff()} day(s)</ListSubheader>
						</List>
						<TextField
							disabled={this.state.loading}
							select
							label="Bus Type"
							style={styles.textField}
							value={this.state.busType}
							onChange={this.handleChange('busType')}
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
						<Grid container>
								<Grid item style={{borderStyle:'solid',borderWidth:0, borderRightWidth:0.5, flex:1}}>
								<List>
									<ListSubheader>Features : </ListSubheader>
										{
											this.state.selectedVehicle.feature.map((item)=>(
												<ListItem>
													<ListItemText primary={item.key +' '+ item.value} />
												</ListItem>
											))
										}
								</List>
								</Grid>
						</Grid>
						<TextField
							disabled={this.state.loading}
							value={this.state.notes}
							onChange={(e)=>this.setState({notes : e.target.value})}
							label="Notes"
							multiline
							rowsMax="4"
							style={styles.textField}
							margin="normal"
							variant="outlined"
							fullWidth
						/>
						<Typography style={{marginTop:8}}>
							Price will be informed via WhatsApp
						</Typography>
				</div>
			);
		}

		dpChange=(e)=>{
			this.setState({
				dpMethod : e.target.value
			})
		}
		fpChange=(e)=>{
			this.setState({
				fullMethod : e.target.value
			})
		}

		convertToRupiah=(angka)=>
		{
			var rupiah = '';		
			var angkarev = angka.toString().split('').reverse().join('');
			for(var i = 0; i < angkarev.length; i++) if(i%3 == 0) rupiah += angkarev.substr(i,3)+'.';
			return 'Rp. '+rupiah.split('',rupiah.length-1).reverse().join('');
		}

		renderFourthStep=()=>{
			return(
				<div>
					<Grid container>
					<TextField
						disabled={this.state.loading}
						select
						label="Payment Method"
						style={{...styles.textField,flex:1}}
						value={this.state.dpMethod}
						onChange={(e)=>this.dpChange(e)}
						margin="normal"
						variant="outlined"
						fullWidth
						>
						<MenuItem key='tf' value='transfer'>
							Transfer
						</MenuItem>
						<MenuItem key='cash' value='tunai'>
							Cash
						</MenuItem>
					</TextField>
					<TextField
						disabled={this.state.loading}
						label="Amount"
						type = "number"
						style={{...styles.textField,flex:1}}
						value={this.state.dpValue}
						onChange={(e)=>{
							if(parseInt(e.target.value) <= parseInt(this.state.price * parseInt(this.getDateDiff()))){
								this.setState({dpValue : e.target.value, fpValue : (this.state.price * parseInt(this.getDateDiff())-parseInt(e.target.value))})
							}
						}}
						margin="normal"
						variant="outlined"
						fullWidth
					/>
					</Grid>
					<Typography style={{marginTop:8}}>
						Remaining : {this.convertToRupiah((this.state.price * parseInt(this.getDateDiff())-parseInt(this.state.dpValue)))}
					</Typography>
					{/* <Grid container>
					<TextField
						disabled={this.state.loading}
						select
						label="Full Payment Method"
						style={{...styles.textField,flex:1}}
						value={this.state.fullMethod}
						onChange={(e)=>this.fpChange(e)}
						margin="normal"
						variant="outlined"
						fullWidth
						>
						<MenuItem key='tf' value='tf'>
							Transfer
						</MenuItem>
						<MenuItem key='cash' value='cash'>
							Cash
						</MenuItem>
					</TextField>
					<TextField
						disabled={this.state.loading}
						label="Amount"
						type = "number"
						style={{...styles.textField,flex:1}}
						value={this.state.fpValue}
						margin="normal"
						variant="outlined"
						fullWidth
					/>
					</Grid> */}
				</div>
			);			
		}

		findVehicleData(){
			const id = this.state.busType;
			return this.state.data.findIndex((item)=>item.id === id);
		}

		dateToShow=(str)=>{
			const monthName = ["January", "February", "March", "April", "May", "June",
				"July", "August", "September", "October", "November", "December"
			];
			let [date,time] = str.split('T');
			let [year, month, day] = date.split('-');

			return day + ' ' + monthName[parseInt(month)-1] + ' ' + year + ' ' + time
		}

		renderFifthStep=()=>{
			return (
				<div>
					<ListSubheader>Reservation Data</ListSubheader>
						<Grid container>
							<List style={{flex:1}}>
									<ListItem>
										<ListItemText primary="Client Name" secondary={this.state.value} />
									</ListItem>
									<ListItem>
										<ListItemText primary="Client Phone Number" secondary={this.state.clientPhone} />
									</ListItem>
									<ListItem>
										<ListItemText primary="Destination" secondary={this.state.destination} />
									</ListItem>
									<ListItem>
										<ListItemText primary="Pickup Location" secondary={this.state.pickup} />
									</ListItem>
							</List>
							<List style={{flex:1}}>
									<ListItem>
										<ListItemText primary="Notes" secondary={this.state.notes} />
									</ListItem>
									<ListItem>
										<ListItemText primary="Vehicle" secondary={this.state.data[this.findVehicleData()].type} />
									</ListItem>
									<ListItem>
										<ListItemText primary="Vehicle Number" secondary={this.state.data[this.findVehicleData()].number} />
									</ListItem>
									<ListItem>
										<ListItemText primary="Start Date" secondary={this.dateToShow(this.state.start_date)} />
									</ListItem>
									<ListItem>
										<ListItemText primary="End Date" secondary={this.dateToShow(this.state.end_date)} />
									</ListItem>
							</List>
						</Grid>
				</div>
			);
		}

		renderWhichStep=(suggestions,inputProps,step)=>{
			switch(step){
				default : return (<div></div>);
				case 0 :
					return this.renderFirstStep(suggestions,inputProps);
				case 1 :
					return this.renderSecondStep();
				case 2 :
					return this.renderThirdStep();
				case 3 :
					return this.renderFifthStep();
			}
		}

		nextHandler=()=>{
			this.setState({activeStep : this.state.activeStep+1});
		}

		snackbars=()=>{
			return(
				<div>
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
				</div>
			);
		}

	render() {
		//const { classes } = props;
		const { value, suggestions, activeStep } = this.state;
		const inputProps = {
			value,
			onChange: this.onChange,
			inputRef: node => {
				this.popperNode = node;
			  }
		  };
		return(
			<div >
				<Paper style={styles.root} elevation={1}>
					<Typography variant="h4" gutterBottom style={styles.title}>New Reservation</Typography>
					<Stepper alternativeLabel nonLinear activeStep={activeStep}>
					{
							steps.map((label,index)=>(
								<Step key={index}>
								<StepButton
								>
									{label}
									</StepButton>
								</Step>
								))
							}
					
					</Stepper>
						<form>
					{this.renderWhichStep(suggestions,inputProps,activeStep)}
						<div style={{textAlign: 'right'}}>
							{
								this.state.activeStep > 0 && this.state.activeStep < steps.length ?
								<Button disabled={this.state.loading} variant="contained" color='default' style={{...styles.button, marginRight:8}} onClick={()=>this.setState({activeStep : this.state.activeStep-1})}>
									<BackIcon style={styles.leftIcon} />
									Back
								</Button>
								:
								null
							}
							{
								this.state.activeStep === (steps.length-1)?
								<Button disabled={this.shouldNextActive()} variant="contained" color="primary" style={styles.button} onClick={()=>this._handleSubmitButton()}>
									<SaveIcon style={styles.leftIcon} />
									Submit
								</Button>
								:
								<Button disabled={this.shouldNextActive()} variant="contained" color="primary" style={styles.button} onClick={()=>{this.nextHandler()}}>
									Next
									<NextIcon style={{marginLeft:8}} />
								</Button>
							}
						</div>
					</form>
					{this.snackbars()}
				</Paper>
			</div>
		)
	}
}

export default withStyles(styles)(Reservation);
