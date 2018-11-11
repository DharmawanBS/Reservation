import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

const bus_types = [
	{
	  value: 'type-a',
	  label: 'Numeric',
	},
	{
	  value: 'type-b',
	  label: 'Date Time',
	},
	{
	  value: 'type-c',
	  label: 'Varchar',
	},
];
export default class EditUserForm extends Component{
    state={
        form : [''],
        added : false,
        checked: true
    }

    _spanNewTextfield=()=>{
        let arr = [...this.state.form];
        arr.push("");
        this.setState({
            form : arr,
            added : true
        })
    }

    handleChange = name => event => {
        this.setState({ checked : event.target.checked });
      };
    
    render(){
        return(
            <Grid style={{flex:0.8}}>
                <Paper style={{padding:16}}>
                    <Typography variant='h6'>
                        Edit User Form
                    </Typography>
                    <Grid container style={{flex:1, marginTop:16}}>
                        <TextField
                            style={{flex:1, marginRight:8}}
                            id="phone"
                            label="Label"
                            margin="dense"
                            variant="outlined"
                        />
                        <TextField
                            style={{flex:1, marginLeft:8}}
							id="bus-type"
							select
							label="Data Type"
                            margin="dense"
							value={this.state.busType}
							variant="outlined"
						>
							{bus_types.map(option => (
								<MenuItem key={option.value} value={option.value}>
								{option.label}
								</MenuItem>
							))}
						</TextField>
                        <FormControlLabel
                            style={{flex:1, marginLeft:8}}
                            control={
                                <Switch
                                checked={this.state.checkedB}
                                onChange={this.handleChange('checkedB')}
                                value="checkedB"
                                color="Primary"
                                />
                            }
                            label="Show To User"
                        />
                        <FormControlLabel
                            style={{flex:1, marginLeft:8}}
                            control={
                                <Switch
                                checked={this.state.checkedB}
                                onChange={this.handleChange('checkedB')}
                                value="checkedB"
                                color="Primary"
                                />
                            }
                            label="Required"
                        />
                    </Grid>
                    {
                        this.state.form.map((item,id)=>(
                            <Grid container style={{flex:1}}>
                                <TextField
                                    style={{flex:1, marginRight:8}}
                                    id="phone"
                                    label="Label"
                                    margin="dense"
                                    variant="outlined"
                                    autoFocus={id === this.state.form.length-1 && this.state.added? true:false}
                                />
                                <TextField
                                    style={{flex:1, marginLeft:8}}
                                    id="bus-type"
                                    select
                                    label="Data Type"
                                    margin="dense"
                                    value={this.state.busType}
                                    variant="outlined"
                                >
                                    {bus_types.map(option => (
                                        <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                                <FormControlLabel
                                    style={{flex:1, marginLeft:8}}
                                    control={
                                        <Switch
                                        checked={this.state.checkedB}
                                        onChange={this.handleChange('checkedB')}
                                        value="checkedB"
                                        color="Primary"
                                        />
                                    }
                                    label="Show To User"
                                />
                                <FormControlLabel
                                    style={{flex:1, marginLeft:8}}
                                    control={
                                        <Switch
                                        checked={this.state.checkedB}
                                        onChange={this.handleChange('checkedB')}
                                        value="checkedB"
                                        color="Primary"
                                        />
                                    }
                                    label="Required"
                                />
                            </Grid>
                        ))
                    }
                    <Grid style={{textAlign:'right', marginBottom:24, marginTop:8}}>
                        <Button variant='outlined' onClick={()=>this._spanNewTextfield()}>
                            Add more field
                        </Button>
                    </Grid>
                    <Grid style={{textAlign:'right'}}>
                        <Button variant='contained' color='primary' style={{marginRight:16}}>
                            Submit
                        </Button>
                        <Button variant='contained' color='secondary' onClick={this.props.closeDialog}>
                            Cancel
                        </Button>
                    </Grid>
                </Paper>
            </Grid>
        )
    }
};