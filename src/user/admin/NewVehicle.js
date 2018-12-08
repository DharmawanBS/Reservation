import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Cookies from 'universal-cookie';

const cookie = new Cookies();

export default class NewVehicle extends Component {

    state={
        spec : [''],
        added : false,
        dialog : false
    }

    _spanNewTextfield=()=>{
        let arr = [...this.state.spec];
        arr.push("");
        this.setState({
            spec : arr,
            added : true
        })
    }

    _getFeature=()=>{
        var feature_temp = {};
        let len = this.state.spec.length;
        for(let x=0;x<len;x++){
            let key = this['feature'+x].value;
            let value = this['amount'+x].value;
            feature_temp[key+''] = value;
        }
        return feature_temp;
    }

    _buildObject=()=>{
        var object ={
            user : cookie.get('user_id'),
            type : this['type'].value,
            number : this['number'].value,
            feature : this._getFeature(),
            price : this['price'].value
        }
        console.log(JSON.stringify(object));
        return JSON.stringify(object);
    }

    _onSubmit=()=>{
        if(!this._emptyChecker()){
            this.setState({
                dialog : true
            })
        }
    }

    _emptyChecker=()=>{
        switch(true){
            case this['type'].value === '' :
            case this['number'].value === '' :
            case this['price'].value === '':
            return true;
            default : return false;
        }
    }

    _closeDialog=()=>{
        this.setState({
            dialog : false
        })
    }

    _submitSuccess(){
        this.props.successSubmit();
    }

    _submitNewVehicle=()=>{
        this._closeDialog();
        fetch('http://api.jakartabusrent.com/index.php/Vehicle/insert',{
            method : 'POST',
            headers: {
                'content-type': 'application/json',
                'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
            },
            body : this._buildObject()
        }).then(response => response.json())
        .then(responseJSON =>{
            if(responseJSON.msg.toLowerCase() === 'ok'){
                this._submitSuccess();
                this.props.closeDialog();
            }
        })
    }

    render() {
		return(
			<Grid style={{flex:1}}>
                <TextField
                    inputRef={input => this['type'] = input}
                    id="phone"
                    label="Vehicle Type"
                    fullWidth
                    margin="dense"
                    variant="outlined"
                />
                <TextField
                    inputRef={input => this['number'] = input}
                    id="phone"
                    label="Plate Number"
                    fullWidth
                    margin="dense"
                    variant="outlined"
                />
                <TextField
                    inputRef={input => this['price'] = input}
                    label="Price per Day"
                    fullWidth
                    type='number'
                    margin="dense"
                    variant="outlined"
                />
                {
                    this.state.spec.map((item,id)=>(
                        <Grid container>
                        <TextField
                            inputRef={input => this['feature'+id] = input}
                            label="Feature"
                            fullWidth
                            margin="dense"
                            variant="outlined"
                            style={{flex:1}}
                            autoFocus={id === this.state.spec.length-1 && this.state.added? true:false}
                        />
                        <TextField
                        inputRef={input => this['amount'+id] = input}
                            type='number'
                            label="Amount"
                            fullWidth
                            style={{flex:0.3}}
                            margin="dense"
                            variant="outlined"
                        />
                        </Grid>
                    ))
                }
                <div style={{textAlign:'right'}}>
                    <Button style={{textAlign:'right'}} onClick={()=>this._spanNewTextfield()}>
                        Add more
                    </Button>
                </div>
                <Grid style={{textAlign:'right', marginTop:16}}>
                    <Button variant='contained' color='primary' style={{marginRight:16}} onClick={()=>this._onSubmit()}>
                        Submit
                    </Button>
                    <Button variant='contained' color='secondary' onClick={this.props.closeDialog}>
                        Cancel
                    </Button>
                </Grid>
                <Dialog
                          open={this.state.dialog}
                          onClose={()=>this._closeDialog()}
                        >
                          <DialogTitle id="alert-dialog-title">{"Submit this new vehicle data?"}</DialogTitle>
                          <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                Make sure everything is correct
                            </DialogContentText>
                          </DialogContent>
                          <DialogActions>
                            <Button onClick={()=>this._closeDialog()} color="primary">
                              No
                            </Button>
                            <Button onClick={()=>this._submitNewVehicle()} color="primary" autoFocus>
                              Yes
                            </Button>
                          </DialogActions>
                        </Dialog>
            </Grid>
		)
	}
}