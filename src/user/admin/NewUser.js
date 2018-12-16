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
import IconButton from '@material-ui/core/IconButton';

//icons
import SaveIcon from '@material-ui/icons/Save';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import green from '@material-ui/core/colors/green';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import ArrowBack from '@material-ui/icons/ArrowBack';
import { Grid } from '@material-ui/core';

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

const cookie = new Cookies();

//class for create new user
class NewUser extends Component {
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
		data : [],
		submit_success : false,
        loading : false,
        showPassword: false,
        password: '',
        userTypes: '',
	};

    handleBackButton = () => {
        this.props.history.push({
            pathname : '/admin/users',
          });
    };

    handleClickShowPassword = () => {
        this.setState(state => ({ showPassword: !state.showPassword }));
    };

	fetchData=()=>{
		fetch('http://www.api.jakartabusrent.com/index.php/User_type/read',{
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
		this.fetchData();
	}


    _emptyChecker=()=>{
		var empty = false;
		switch(true){
			case this['name'].value === '' :
			case this['key'].value === '':
			case this.state.password === '':
			case this.state.userTypes === '':
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
		fetch('http://www.api.jakartabusrent.com/index.php/User/insert',{
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
                this.handleBackButton();
            }
		})
		.catch(e=>console.log(e));
	}
    
	_buildPayload=()=>{
		var obj ={
			user : cookie.get('user_id'),
			name : this['name'].value,
			key : this['key'].value,
			password : this.state.password,
			type : this.state.userTypes,
		}
		console.log(JSON.stringify(obj));
		return JSON.stringify(obj);
	}

	render() {
        const { classes } = this.props;
		return(
			<Grid className={classes.divRoot} xl={8} xs={12} sm={10} md={10} lg={8}>
				<Paper className={classes.root} elevation={1}>
					<Typography variant="h4" gutterBottom className={classes.title}>New User</Typography>
					<form>
                        <TextField
                            id="user-name"
                            disabled={this.state.loading}
							inputRef = {(input) => this['name'] = input}
                            label="User Name"
                            fullWidth
                            className={[classes.textField, classes.dense]}
                            margin="dense"
                            variant="outlined"
                        />
                        <TextField
                            id="user-key"
                            disabled={this.state.loading}
							inputRef = {(input) => this['key'] = input}
                            label="User Key"
                            fullWidth
                            className={[classes.textField, classes.dense]}
                            margin="dense"
                            variant="outlined"
                        />
                        <TextField
                            id="user-password"
                            disabled={this.state.loading}
							inputRef = {(input) => this['password'] = input}
                            className={[(classes.dense, classes.textField)]}
                            variant="outlined"
                            type={this.state.showPassword ? 'text' : 'password'}
                            label="User Password"
                            fullWidth
                            value={this.state.password}
                            onChange={this.handleChange('password')}
                            InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                <IconButton
                                    aria-label="Toggle password visibility"
                                    onClick={this.handleClickShowPassword}
                                >
                                    {this.state.showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                                </InputAdornment>
                            ),
                            }}
                        />
                        <TextField
                            select
                            disabled={this.state.loading}
							inputRef = {(input) => this['type'] = input}
                            label="User Type"
                            className={[classes.textField, classes.dense]}
                            value={this.state.userTypes}
                            onChange={this.handleChange('userTypes')}
                            margin="dense"
                            variant="outlined"
                            fullWidth
                            SelectProps={{
                            MenuProps: {
                            
                            },
                            }}
                        >
                            {this.state.data.map(option => (
                            <MenuItem key={option.id} value={option.id}>
                            {option.name}
                            </MenuItem>
                            ))}
                        </TextField>
						<div style={{textAlign: 'right'}}>
                            <Button disabled={this.state.loading} variant="contained" color="secondary" className={classes.button} onClick={()=>this.handleBackButton()}>
								<ArrowBack style={styles.leftIcon} />
								Back Without Saving
							</Button>
                            <Button disabled={this.state.loading} variant="contained" color="primary" className={classes.button} onClick={()=>this._handleSubmitButton()}>
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
			</Grid>
		)
	}
}

export default withStyles(styles)(NewUser);