import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

export default class NewVehicle extends Component {

    state={
        spec : [''],
        added : false
    }

    _spanNewTextfield=()=>{
        let arr = [...this.state.spec];
        arr.push("");
        this.setState({
            spec : arr,
            added : true
        })
    }

    render() {
		return(
			<Grid>
                <TextField
                    id="phone"
                    label="Vehicle Type"
                    fullWidth
                    margin="dense"
                    variant="outlined"
                />
                <TextField
                    id="phone"
                    label="Plate Number"
                    fullWidth
                    margin="dense"
                    variant="outlined"
                />
                {
                    this.state.spec.map((item,id)=>(
                        <TextField
                            id="phone"
                            label="Specification"
                            fullWidth
                            margin="dense"
                            variant="outlined"
                            autoFocus={id === this.state.spec.length-1 && this.state.added? true:false}
                        />
                    ))
                }
                <Button style={{textAlign:'right'}} onClick={()=>this._spanNewTextfield()}>
                    Add more
                </Button>
                <Grid style={{textAlign:'right'}}>
                    <Button variant='contained' color='primary' style={{marginRight:16}}>
                        Submit
                    </Button>
                    <Button variant='contained' color='secondary' onClick={this.props.closeDialog}>
                        Cancel
                    </Button>
                </Grid>
            </Grid>
		)
	}
}