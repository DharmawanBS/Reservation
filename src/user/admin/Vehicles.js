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

//icons
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/DeleteOutline';
import EditIcon from '@material-ui/icons/Edit';
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

class Vehicle extends Component {
  state = {
      expanded : null,
      edit : [{}],
      spec : [
        "- Jumlah kursi 59 seat",
        "- Air Conditioner",
        "- Mic",
        "- TV",
        "- DVD",
        "- Karaoke",
        "- cool box",
        "- crew yg berpengalaman",
        "- helper yg ramah"
      ],
      dialog : false,
      dialogDelete : false,
      oldSpec : [],
      price : '10000000',
      data :[],
      snack : false,
      edit_success : false,
      delete_success : false,
      loading : true,
      search : '',
      data_search : [],
      no_data : false,
      temp_pic : '',
      userTypes : []
  };

  constructor(props){
    super(props);
    this.imagePickerRef = React.createRef();
  }

  componentDidMount(){
    this.fetchUserType();
    this.fetchData();
  }

  fetchUserType=()=>{
    fetch('http://www.api.jakartabusrent.com/index.php/User_type/read',{
      method : 'POST'
    }).then(response => response.json())
    .then(responseJSON => {
      const status = responseJSON.msg.toLowerCase();
      const userTypes = responseJSON.data;
      if(status === 'ok'){
        this.setState({
          userTypes
        })
      }
    })
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
          data : responseJSON.data,
          data_search : responseJSON.data
        });
        for(let x=0;x<responseJSON.data.length;x++){
          arr.push({id : responseJSON.data[x].id, edit_now : false});
        };
        this.setState({
          edit : arr,
          loading : false
        })
      }
    })
  }

  handleChange = panel => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false,
    });
  };

  _handleTextFieldChange =(e,id)=> {
    let arr = [...this.state.spec];
    arr[id] = e.target.value;
    this.setState({
        spec: arr
    });
  }

  _handleCloseDialog=()=>{
    this.setState({
      dialog:false,
    })
  }

  _handleCloseDialogDelete=()=>{
    this.setState({
      dialogDelete:false,
    })
  }

  _handleDeleteData=(data_id)=>{
    var obj = {id : data_id};
    
    fetch('http://api.jakartabusrent.com/index.php/Vehicle/delete',{
      method : 'POST',
      headers: {
        'content-type': 'application/json',
        'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
      },
      body : JSON.stringify(obj)
    }).then(response => response.json())
    .then(responseJSON => {
      if(responseJSON.msg.toLowerCase() === 'ok'){
        this.fetchData();
        this.setState({delete_success : true, dialogDelete : false});
      }
    })
  }

  _handleOpenDialogDelete=()=>{
    this.setState({dialogDelete:true})
  }

  _handleDeleteSpec=(id,ids)=>{
    var myData = [...this.state.data];
    var features = myData[myData.findIndex(item=>item.id === id)].feature;
    features.splice(ids,1);
    
    let len = features.length;
    for(let x=0; x<len; x++){
      this['key'+x].value = features[x].key;
      this['value'+x].value = features[x].value;
    }
    myData[id].feature = features;
    this.setState({
      data : myData
    })
  }

  _handleEdit=(item_id)=>{
    // let arr = [...this.state.edit];
    // arr[arr.findIndex(item=>item.id === item_id)].edit_now=true;
    // this.setState({
    //   edit : arr,
    //   oldSpec : this.state.data[this.state.data.findIndex(item=>item.id === item_id)].feature
    // })
    let dataId = this.state.data.findIndex((item) => item.id === item_id)
    let vehicleData = this.state.data[dataId];
    let userTypes = this.state.userTypes;
    this.props.history.push({
      pathname : this.props.location.pathname+'/edit/1',
      state : {
        vehicleData,
        userTypes,
        locate : this.props.location.pathname
      }
    })
  }

  _handleSave=(feature,item_id)=>{
    let len = feature.length;
    var arr = []
    for(let x=0; x<len; x++){
      let key = this['key' + x].value;
      let value = this['value' + x].value;
      let obj = {
        key, value
      }
      arr.push(obj);
    }
    var myData = [...this.state.data];
    myData[myData.findIndex(item => item.id === item_id)].feature = arr;
    myData[myData.findIndex(item => item.id === item_id)].price = this['price'+item_id].value;
    var editor = [...this.state.edit];
    editor[myData.findIndex(item => item.id === item_id)].edit_now = false;
    this.setState({
      data : myData,
      edit : editor
    })
    var all = {...this.state.data[myData.findIndex(item => item.id === item_id)], user : cookies.get('user_id')};
    var new_format = {};
    all.feature.forEach((element,id) => {
      new_format[element.key] = element.value
    });
    all.feature = new_format;
    all.price = this['price'+item_id].value;
    console.log(all);
    fetch('http://api.jakartabusrent.com/index.php/Vehicle/update',{
      method : 'POST',
      headers: {
        'content-type': 'application/json',
        'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
      },
      body : JSON.stringify(all)
    }).then(response => response.json())
    .then(responseJSON =>{
      var status = responseJSON.msg.toLowerCase();
        if(status === 'ok'){
            this.setState({
              edit_success : true
            })
        }else if(status === 'empty'){
          this.setState({no_data : true})
        }
    })
  }

  _handleCancel=(item_id)=>{
    var arr = [...this.state.edit];
    arr[arr.findIndex(item=>item.id === item_id)].edit_now=false;
    var features = [...this.state.data];
    features[features.findIndex(item=>item.id===item_id)].feature = this.state.oldSpec;
    
    this.setState({
      edit : arr,
      data : features
    })
  }

  _newVehicleSuccess =()=>{
    this.setState({snack : true, loading:true, data : [], data_search :[], edit :[]})
    this.fetchData();
  }

  getSuggestions = () => {
    const inputValue = this.state.search.trim().toLowerCase();
    const inputLength = inputValue.length;
  
    var arr = inputLength === 0 ? this.state.data : this.state.data.filter(item =>
      item.type.toLowerCase().slice(0, inputLength) === inputValue || item.number.toLowerCase().slice(0, inputLength) === inputValue
    );
    this.setState({
      data_search : arr
    })
  };

  _checkEditNow=(item_id)=>{
    return this.state.edit.findIndex(item=>item.id === item_id);
  }

  _handleFilePicker=(e)=>{
    e.preventDefault();
    this.setState({temp_pic : URL.createObjectURL(e.target.files[0])})
    console.log(URL.createObjectURL(e.target.files[0]));
  }

  render() {
      const {expanded} = this.state;
      if(this.state.loading){
        return (
          <Grid container justify='center' alignItems='center' style={{flex:1, height:'80vh', padding:16}}>
            <CircularProgress size={100} style={{alignSelf:'center'}}/>
          </Grid>
        );
      }else{
        if(this.state.no_data){
          return (
            <Grid container justify='center' alignItems='center' style={{flex:1, height:'80vh', padding:16, opacity:0.3}}>
              <Grid item style={{textAlign:'center'}}>
                <ErrorIcon style={{alignSelf:'center', fontSize:175}}/>
                <Typography variant='h6'>
                  No Vehicle Data Found
                </Typography>
              </Grid>
            </Grid>
          );
        }else{
          return (
            <Grid container justify='center' alignItems='center' style={{flex:1}}>
                <Paper style={{paddingTop:0, padding:16, textAlign:'center', width:'85vw'}}>
                <Grid style={{padding:8, marginBottom:8}} container alignItems="flex-end" justify='flex-end' >
                  <Grid container style={{borderWidth:0.5,borderStyle:'solid', borderRadius:5, borderColor:'rgba(0,0,0,0.2)',height:50, width:250}} alignItems="center" justify='flex-start' >
                    <Grid item onClick={()=>this['search'].focus()} style={{padding:8,borderWidth:0, borderRightWidth:0.5, borderStyle:'solid',borderColor:'rgba(0,0,0,0.2)'}}>
                        <SearchIcon style={{fontSize:25, verticalAlign:'center', color:'rgba(0,0,0,0.2)'}}/>
                      </Grid>
                    <Grid item>
                      <TextField value={this.state.search} onChange={(e)=>{
                        this.setState({search : e.target.value},()=>this.getSuggestions())
                      }}
                      style={{fontSize:18, padding:8}}
                      placeholder='Search...'
                      InputProps={{disableUnderline : true}}
                      type='search'
                      inputRef={(input)=> this['search'] = input}/>
                    </Grid>
                  </Grid>
                </Grid>
                {
                  this.state.data_search.map((item)=>(
                    <ExpansionPanel expanded={expanded === 'panel'+item.id} onChange={this.handleChange('panel'+item.id)}>
                      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant='h5'>{item.type} {item.number}</Typography>
                      </ExpansionPanelSummary>
                      <ExpansionPanelDetails>
                      <Grid style={{paddingTop:16}}>
                          <Grid container>
                            <GridList style={{transform:'translateZ(0)', flex:1, justifyContent:'center', overflow:'auto', maxHeight:500}}>
                                {tileData.map(tile => (
                                <GridListTile key={tile.img} style={{height:100, width:200}}>
                                    <img src={tile.img} alt={tile.title}/>
                                    <GridListTileBar
                                    title={tile.title}
                                    />
                                </GridListTile>
                                ))}
                            </GridList>
                            <Grid style={{flex:0.5}}>
                            <Typography variant="h5" id="simple-modal-description" style={{textAlign:'left', flex:0.5, marginLeft:24, marginBottom:8}}>
                                Features
                            </Typography>
                            <Grid style={{overflow:'auto', maxHeight:500, overflowX:'hidden'}}>
                            {
                              item.feature.map((item,id)=>(
                                  <Grid container style={{textAlign:'left', flex:1, marginLeft:8,padding:8,fontWeight:'normal'}}>
                                  <Typography variant='subheading' style={{verticalAlign:'center'}}>
                                    {item.value} {item.key}
                                  </Typography>
                                  </Grid>
                                ))
                            }
                            </Grid>
                            <Typography variant="h5" id="simple-modal-description" style={{textAlign:'left', flex:0.5, marginLeft:24, marginTop:16}}>
                                Price
                            </Typography>
                            <Typography variant="subtitle1" style={{textAlign:'left', flex:0.5, marginLeft:8,padding:8}}>
                                Rp. {item.price} / day
                            </Typography>
                            </Grid>
                          </Grid>
                          <Grid style={{textAlign:'right', marginTop:8}}>
                            <Button variant='contained' color='secondary'
                              onClick={()=>{
                                if(window.confirm('Are you sure?')){
                                  this._handleDeleteData(item.id)
                                }
                              }}
                              style={{marginRight:16}}>
                                Delete
                                <DeleteIcon style={{fontSize:15, marginLeft:8}}/>
                              </Button>
                           
                            <Button variant='outlined' onClick={()=>this._handleEdit(item.id)}>
                              EDIT
                              <EditIcon style={{fontSize:15, marginLeft:8}}/>
                            </Button>
                          </Grid>
                        </Grid>
                      </ExpansionPanelDetails>
                    </ExpansionPanel>
                  ))
                }
                </Paper>
                <Button variant="fab" color="primary" aria-label="Add" style={{position:'fixed', right:'5%', bottom:'5%'}} onClick={()=>this.setState({dialog:true})}>
                    <AddIcon />
                </Button>
                <Dialog open={this.state.dialog} onClose={()=>this.setState({dialog : false})} maxWidth='lg'>
                  <Grid style={{padding:16}}>
                    <DialogTitle>New Vehicle</DialogTitle>
                    <NewVehicle userTypes={this.state.userTypes} closeDialog={this._handleCloseDialog.bind(this)} successSubmit={this._newVehicleSuccess.bind(this)}/>
                  </Grid>
                </Dialog>
                <Snackbar
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  open={this.state.snack}
                  autoHideDuration={6000}
                  onClose={()=>this.setState({snack:false})}
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
                          Added new vehicle
                        </span>
                    }
                    />
                </Snackbar>
                <Snackbar
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  open={this.state.delete_success}
                  autoHideDuration={6000}
                  onClose={()=>this.setState({delete_success:false})}
                  ContentProps={{
                    'aria-describedby': 'message-id',
                  }}
                >
                    <SnackbarContent
                    aria-describedby="client-snackbar"
                    style={{backgroundColor:amber[700]}}
                    message={
                        <span id="client-snackbar" style={{display: 'flex',alignItems: 'center',}}>
                        <InfoIcon style={{fontSize:20, opacity:0.9, marginRight:8}}/>
                          Data deleted
                        </span>
                    }
                    />
                </Snackbar>
                <Snackbar
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                  }}
                  open={this.state.loading}
                  autoHideDuration={6000}
                  onClose={this.handleClose}
                  ContentProps={{
                    'aria-describedby': 'message-id',
                  }}
                  message={<span id="message-id">Loading...</span>}
                />
            </Grid>
            );
        }
      }
  }
}

export default Vehicle;