import React, { Component, createRef } from "react";
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Button from '@material-ui/core/Button';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import Tooltip from '@material-ui/core/Tooltip';
import Cookies from 'universal-cookie';
import moment from 'moment';

//icons
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/DeleteOutline';
import EditIcon from '@material-ui/icons/Edit';
import CancelIcon from '@material-ui/icons/Cancel';
import DoneIcon from '@material-ui/icons/Done';
import ErrorIcon from '@material-ui/icons/Error';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import SearchIcon from '@material-ui/icons/Search';
import InfoIcon from '@material-ui/icons/Info';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import green from '@material-ui/core/colors/green';
import amber from '@material-ui/core/colors/amber';

const cookie = new Cookies();
const date = new moment().format('YYYY-MM-DD');
export default class NewVehicle extends Component {

    state={
        spec : [''],
        added : false,
        dialog : false,
        newFeature : [''],
        loading : false
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
        fetch('http://www.api.jakartabusrent.com/index.php/Vehicle/insert',{
            method : 'POST',
            headers: {
                'content-type': 'application/json',
                'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
            },
            body : this._buildObject()
        }).then(response => response.json())
        .then(responseJSON =>{
            var status = responseJSON.msg.toLowerCase();
            if(status === 'ok'){
                this._submitSuccess();
                this.props.closeDialog();
            }
        })
    }
    spawnTitle(text, big=false){
        return (
          <Typography variant={big? 'h4' : 'h5'} id="simple-modal-description" style={{textAlign:'left', flex:0.5,marginBottom:8}}>
              {text}
          </Typography>
        );
      }

    render() {
        const {newFeature} = this.state;
        const {userTypes} = this.props;
		return(
			<Grid container justify='center'>
            <Paper style={{width:'90vw', padding:16}}>
                <TextField
                    inputRef = {(input) => this['vehicleType'] = input}
                    label='Vehicle Type'
                    margin='normal'
                    variant='outlined'
                    style={{flex:1}}
                    disabled={this.state.loading}
                    inputProps={{
                    style : {fontSize : 25}
                    }}
                />
                <TextField
                    inputRef = {(input) => this['plateNumber'] = input}
                    label='Plate Number'
                    margin='normal'
                    variant='outlined'
                    style={{flex:1}}
                    disabled={this.state.loading}
                    inputProps={{
                    style : {fontSize : 25}
                    }}
                />
                <Grid container direction='row'>
                    <Grid item  style={{flex:1}}>
                    {this.spawnTitle('Photos')}
                    <GridList style={{transform:'translateZ(0)', flex:1, justifyContent:'center', overflow:'auto', maxHeight:500, marginTop:16}}>
                        <input type='file' ref={this.imagePickerRef} accept='image/*' style={{display:'none'}} onChange={(e)=>this._handleFilePicker(e)}/>
                        <GridListTile key='icon' style={{height:100, width:100}}>
                            <Tooltip title='Add New' placement='bottom'>
                            <IconButton onClick={()=>this.imagePickerRef.current.click()}>
                                <AddCircleIcon style={{fontSize:70}}/>
                            </IconButton>
                            </Tooltip>
                        </GridListTile>
                    </GridList>
                    </Grid>
                    <Grid item style={{flex:1, marginLeft:24}}>
                    {this.spawnTitle('Features')}
                    <Grid style={{textAlign:'center'}}>
                        {
                        newFeature.map((item,newFeatureId)=>(
                            <Grid container>
                            <TextField
                                inputRef={(input)=>{this['newKey'+newFeatureId] = input}}
                                defaultValue={item.key}
                                label='Feature'
                                margin='normal'
                                variant="outlined"
                                style={{flex:1}}
                                disabled={this.state.loading}
                            />
                            <TextField
                                inputRef={(input)=>{this['newValue'+newFeatureId] = input}}
                                defaultValue={item.value}
                                margin="normal"
                                label='Amount'
                                variant="outlined"
                                type='number'
                        style={{flex:0.5}}
                        disabled={this.state.loading}
                      />
                      <IconButton style={{flex:0.15}} onClick={()=>this.deleteFeature(newFeatureId)}>
                          <DeleteIcon style={{fontSize:'30'}}/>
                        </IconButton>
                    </Grid>
                  ))
                }
                <Button onClick={()=>this.addNewFeatureClick()}>
                  Add new Feature
                </Button> 
              </Grid>
            </Grid>
          </Grid>
          <Grid container style={{marginTop:16}}>
            <Grid item style={{flex:1}}>
              {this.spawnTitle('Prices')}
              <TextField
                value='Default Price'
                label='Account Type'
                margin="normal"
                variant="outlined"
                style={{flex:1}}
                disabled={this.state.loading}
              />
              <TextField
                inputRef={(input)=>{this['defaultPrice'] = input}}
                margin="normal"
                label='Price'
                variant="outlined"
                type='number'
                style={{flex:1}}
                disabled={this.state.loading}
              />
              <Grid style={{textAlign:'center'}}>
                  {
                    userTypes.map((item, id)=>(
                      <Grid container>
                      <TextField
                        inputRef={(input)=>{this['userType'+id] = input}}
                        value={item.name}
                        label='Account Type'
                        margin="normal"
                        variant="outlined"
                        style={{flex:1}}
                        disabled={this.state.loading}
                      />
                      <TextField
                        inputRef={(input)=>{this['newPrice'+id] = input}}
                        margin="normal"
                        label='Price'
                        variant="outlined"
                        type='number'
                        style={{flex:0.5}}
                        disabled={this.state.loading}
                      />
                      <TextField
                        inputRef={(input)=>{this['startDate'+id] = input}}
                        margin="normal"
                        label='Starting Date'
                        defaultValue = {date}
                        variant="outlined"
                        type='date'
                        style={{flex:1}}
                        disabled={this.state.loading}
                        InputLabelProps={{
                          shrink : true
                        }}
                      />
                      </Grid>
                    ))
                  }
              </Grid>
            </Grid>
            <Grid container style={{flex:1}} justify='flex-end' alignContent='flex-end' alignItems='flex-end' spacing={16}>
              <Grid item>
              <Button disabled={this.state.loading} variant='outlined' color='primary' onClick={()=>this.submitPayload()}>
                SAVE
                <DoneIcon style={{fontSize:15, marginLeft:8}}/>
              </Button>
              </Grid>
              <Grid item>
              <Button disabled={this.state.loading} variant='outlined' color='secondary' onClick={()=>this.cancelClick()}>
                CANCEL
                <CancelIcon style={{fontSize:15, marginLeft:8}}/>
              </Button>
              </Grid>
            </Grid>
          </Grid>
          </Paper>
      </Grid>
		)
	}
}