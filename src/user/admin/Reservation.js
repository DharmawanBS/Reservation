import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import InputAdornment from '@material-ui/core/InputAdornment';

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
	};
	state = {
		type: '',
		pickup: '',
		destination: '',
		dateNow: date,
		busType: '',
		price: ''
	};

	render() {
		//const { classes } = props;
		return(
			<div>
				<Paper style={styles.root} elevation={1}>
					<Typography variant="h4" gutterBottom style={styles.title}>New Reservation</Typography>
					<form>
						<TextField
							id="client-name"
							label="Client Name"
							fullWidth
							style={[styles.textField, styles.dense]}
							margin="dense"
							variant="outlined"
						/>
						<TextField
							id="client-type"
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
							id="phone"
							label="Phone"
							fullWidth
							style={[styles.textField, styles.dense]}
							margin="dense"
							variant="outlined"
						/>
						<TextField
							id="destination"
							label="Destination"
							multiline
							rowsMax="4"
							value={this.state.destination}
							onChange={this.handleChangeTextbox('destination')}
							style={styles.textField}
							margin="normal"
							variant="outlined"
							fullWidth
						/>
						<TextField
							id="pickup-loc"
							label="Pick Up Location"
							multiline
							rowsMax="4"
							value={this.state.pickup}
							onChange={this.handleChangeTextbox('pickup')}
							style={styles.textField}
							margin="normal"
							variant="outlined"
							fullWidth
						/>
						<TextField
							id="start-date"
							label="Starting Date"
							type="datetime-local"
							defaultValue={this.state.dateNow}
							style={styles.textField}
							InputLabelProps={{
							shrink: true,
							}}
							fullWidth
						/>
						<TextField
							id="end-date"
							label="End Date"
							type="datetime-local"
							defaultValue={this.state.dateNow}
							style={styles.textField}
							InputLabelProps={{
							shrink: true,
							}}
							fullWidth
						/>
						<TextField
							id="bus-type"
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
							{bus_types.map(option => (
								<MenuItem key={option.value} value={option.value}>
								{option.label}
								</MenuItem>
							))}
						</TextField>
						<TextField
							id="price"
							style={[styles.dense, styles.textField]}
							variant="outlined"
							label="Price"
							value={this.state.price}
							onChange={this.handleChange('price')}
							InputProps={{
								startAdornment: <InputAdornment position="start">IDR</InputAdornment>,
							}}
							fullWidth
							type='Number'
						/>
					</form>
				</Paper>
			</div>
		)
	}
}

export default withStyles(styles)(Reservation);
