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
import NewVehicle from "./NewVehicle";
import ErrorIcon from '@material-ui/icons/Error';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import SearchIcon from '@material-ui/icons/Search';
import InfoIcon from '@material-ui/icons/Info';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import green from '@material-ui/core/colors/green';
import amber from '@material-ui/core/colors/amber';

const cookies = new Cookies();
const date = new moment().format('YYYY-MM-DD');
const tileData = [
  {
    img: "http://www.jakartabusrent.com/lampiran/home1.jpg",
    title: 'Image',
    author: 'author',
  },
  {
   img: "http://www.jakartabusrent.com/lampiran/home1.jpg",
   title: 'Image',
   author: 'author',
 },
 {
   img: "http://www.jakartabusrent.com/lampiran/home1.jpg",
   title: 'Image',
   author: 'author',
 },
 {
   img: "http://www.jakartabusrent.com/lampiran/home1.jpg",
   title: 'Image',
   author: 'author',
 },
 {
   img: "http://www.jakartabusrent.com/lampiran/home1.jpg",
   title: 'Image',
   author: 'author',
 },
 {
   img: "http://www.jakartabusrent.com/lampiran/home1.jpg",
   title: 'Image',
   author: 'author',
 },
];

class VehicleEdit extends Component {
  state = {
    newFeature : this.props.location.state.vehicleData.feature,
    startDate : date,
    newPrices : []

  };

  spawnTitle(text, big=false){
    return (
      <Typography variant={big? 'h4' : 'h5'} id="simple-modal-description" style={{textAlign:'left', flex:0.5,marginBottom:8}}>
          {text}
      </Typography>
    );
  }

  addNewFeatureClick=()=>{
    let newFeature = [...this.state.newFeature];
    newFeature.push('');
    this.setState({newFeature});
  }

  filterEmptySpaces(arr){
    return arr.filter((item)=>(item.key !== null))
  }

  getUserTypeId(userType){
    let userTypes = this.props.location.state.userTypes;
    let index = userTypes.findIndex((item)=>item.name.toLowerCase() === userType.toLowerCase());
    return userTypes[index].id;
  }

  buildFeature(){
    let len = this.state.newFeature.length;
    var temp = [];
    for(let x=0; x<len; x++){
      let key = this['newKey' + x].value;
      let value = this['newValue' + x].value;
      if(key === '') continue;
      let obj = {
        key, value
      }
      temp.push(obj);
    }
    return temp;
  }

  buildPrices(){
    let len = this.props.location.state.userTypes.length;
    var temp = [];
    for(let x=0; x<len; x++){
      let price = this['newPrice'+x].value;
      let start = this['startDate'+x].value;
      let user_type = this.getUserTypeId(this['userType'+x].value);
      temp.push({price,start,user_type})
    }
    return temp;
  }

  buildPayloadObject=()=>{
    console.log(date);
    let payload = {};
    let feature = this.buildFeature();
    let user = cookies.get('user_id');
    let type = this['vehicleType'].value;
    let number = this['plateNumber'].value;
    let prices = this.buildPrices();
    payload.user = user;
    payload.type = type;
    payload.number = number;
    payload.prices = prices;
    payload.feature = feature;
    console.log(JSON.stringify(payload));
  }

  cancelClick(){
    if(window.confirm('Are you sure want to discard changes and go back?')){
      this.props.history.goBack();
    }
  }

  deleteFeature=(index)=>{
    let newFeature = [...this.state.newFeature];
    newFeature.splice(index,1);
    this.setState({newFeature});
  }

  getPrice=(userTypesId)=>{
    let vehicleData = this.props.location.state.vehicleData;
    let defaultPrice = vehicleData.price;
    let pricesData = vehicleData.prices;

    if(pricesData === null){
      return defaultPrice;
    }else{
      const id = pricesData.findIndex((item)=> item.id === userTypesId);
      return pricesData[id].price;
    }

  }

  render() {
    const {vehicleData,userTypes}  = this.props.location.state,
          newFeature   = this.state.newFeature;
    return (
      <Grid container justify='center'>
        <Paper style={{width:'90vw', padding:16}}>
          <TextField
            inputRef = {(input) => this['vehicleType'] = input}
            defaultValue={vehicleData.type}
            label='Vehicle Type'
            margin='normal'
            variant='outlined'
            style={{flex:1}}
            inputProps={{
              style : {fontSize : 25}
            }}
          />
          <TextField
            inputRef = {(input) => this['plateNumber'] = input}
            defaultValue={vehicleData.number}
            label='Plate Number'
            margin='normal'
            variant='outlined'
            style={{flex:1}}
            inputProps={{
              style : {fontSize : 25}
            }}
          />
          <Grid container direction='row'>
            <Grid item  style={{flex:1}}>
              {this.spawnTitle('Photos')}
              <GridList style={{transform:'translateZ(0)', flex:1, justifyContent:'center', overflow:'auto', maxHeight:500, marginTop:16}}>
                {tileData.map(tile => (
                <GridListTile key={tile.img} style={{height:100, width:200}}>
                    <img src={tile.img} alt={tile.title}/>
                    <GridListTileBar
                    title={tile.title}
                    actionIcon={
                      <IconButton>
                        <DeleteIcon style={{color:'#FFF'}}/>
                      </IconButton>
                    }
                    />
                </GridListTile>
                ))}
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
                      />
                      <TextField
                        inputRef={(input)=>{this['newValue'+newFeatureId] = input}}
                        defaultValue={item.value}
                        margin="normal"
                        label='Amount'
                        variant="outlined"
                        type='number'
                        style={{flex:0.5}}
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
              />
              <TextField
                inputRef={(input)=>{this['defaultPrice'] = input}}
                defaultValue={vehicleData.price}
                margin="normal"
                label='Price'
                variant="outlined"
                type='number'
                style={{flex:1}}
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
                      />
                      <TextField
                        inputRef={(input)=>{this['newPrice'+id] = input}}
                        defaultValue={this.getPrice(item.id)}
                        margin="normal"
                        label='Price'
                        variant="outlined"
                        type='number'
                        style={{flex:0.5}}
                      />
                      <TextField
                        inputRef={(input)=>{this['startDate'+id] = input}}
                        margin="normal"
                        label='Starting Date'
                        defaultValue = {date}
                        variant="outlined"
                        type='date'
                        style={{flex:1}}
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
               <Button variant='contained' color='secondary'
                onClick={()=>{
                  if(window.confirm('Are you sure?')){
                    
                  }
                }}>
                    Delete
                    <DeleteIcon style={{fontSize:15, marginLeft:8}}/>
                  </Button>
              </Grid>
              <Grid item>
              <Button variant='outlined' color='primary' onClick={()=>this.buildPayloadObject()}>
                SAVE
                <DoneIcon style={{fontSize:15, marginLeft:8}}/>
              </Button>
              </Grid>
              <Grid item>
              <Button variant='outlined' color='secondary' onClick={()=>this.cancelClick()}>
                CANCEL
                <CancelIcon style={{fontSize:15, marginLeft:8}}/>
              </Button>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    );
  }
}

export default VehicleEdit;