import React, { Component } from "react";
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
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import Cookies from 'universal-cookie';

//icons
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/DeleteOutline';
import EditIcon from '@material-ui/icons/Edit';
import DoneIcon from '@material-ui/icons/Done';
import NewVehicle from "./NewVehicle";
import CloseIcon from '@material-ui/icons/Close';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
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
      edit : [],
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
      loading : true
  };

  componentDidMount(){
    this.fetchData();
  }

  fetchData=()=>{
    fetch('http://api.jakartabusrent.com/index.php/Vehicle/read',{
      method : 'POST'
    }).then(response => response.json())
    .then(responseJSON => {
      console.log(JSON.stringify(responseJSON.data))
      let arr = [];
      if(responseJSON.msg.toLowerCase() === 'ok'){
        this.setState({
          data : responseJSON.data,
        });
        for(let x=0;x<responseJSON.data.length;x++){
          arr.push(false);
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
    var features = myData[id].feature;
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

  _handleEdit=(id)=>{
    let arr = [...this.state.edit];
    arr[id]=true;
    this.setState({
      edit : arr,
      oldSpec : this.state.data[id].feature
    })
  }

  _handleSave=(feature,id,item_id)=>{
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
    myData[id].feature = arr;
    var editor = [...this.state.edit];
    editor[id] = false;
    this.setState({
      data : myData,
      edit : editor
    })
    var all = {...this.state.data[id], user : cookies.get('user_id')};
    var new_format = {};
    all.feature.forEach((element,id) => {
      new_format[element.key] = element.value
    });
    all.feature = new_format;
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
        if(responseJSON.msg.toLowerCase() === 'ok'){
            this.setState({
              edit_success : true
            })
        }
    })
  }

  _handleCancel=(id)=>{
    var arr = [...this.state.edit];
    arr[id]=false;
    var features = [...this.state.data];
    features[id].feature = this.state.oldSpec;
    
    this.setState({
      edit : arr,
      data : features
    })
  }

  _newVehicleSuccess =()=>{
    this.setState({snack : true})
    this.fetchData();
  }

  render() {
      const {expanded} = this.state;
    return (
    <Grid container justify='center' alignItems='center' style={{flex:1, height:'80', padding:16}}>
        <Paper style={{padding:16, textAlign:'center'}}>
        {
          this.state.data.map((item,id)=>(
            <ExpansionPanel expanded={expanded === 'panel'+id} onChange={this.handleChange('panel'+id)}>
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
                            actionIcon={
                              this.state.edit[id]?
                              (
                                <IconButton>
                                  <DeleteIcon style={{color:'#FFF'}}/>
                                </IconButton>
                              )
                              :
                              null
                            }
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
                      !this.state.edit[id]?
                        item.feature.map((item,id)=>(
                          <Grid container style={{textAlign:'left', flex:1, marginLeft:8,padding:8,fontWeight:'normal'}}>
                          <Typography variant='subheading' style={{verticalAlign:'center'}}>
                            {item.value} {item.key}
                          </Typography>
                          </Grid>
                        ))
                      :
                      <Grid>
                      {item.feature.map((item, feature_id)=>(
                        <Grid container>
                        <TextField
                          inputRef={(input)=>{this['key'+feature_id] = input}}
                          defaultValue={item.key}
                          margin="normal"
                          variant="outlined"
                          style={{flex:1}}
                        />
                        <TextField
                          inputRef={(input)=>{this['value'+feature_id] = input}}
                          defaultValue={item.value}
                          margin="normal"
                          variant="outlined"
                          type='number'
                          style={{flex:0.5}}
                        />
                        <IconButton style={{flex:0.3}} onClick={()=>this._handleDeleteSpec(id,feature_id)}>
                            <DeleteIcon style={{fontSize:'30'}}/>
                          </IconButton>
                        </Grid>
                      ))}
                      <Button onClick={()=>{
                        item.feature.push("")
                        this.setState({data: this.state.data})
                      }}>
                        Add new
                      </Button> 
                      </Grid>
                    }
                    </Grid>
                    <Typography variant="h5" id="simple-modal-description" style={{textAlign:'left', flex:0.5, marginLeft:24, marginTop:16}}>
                        Harga
                    </Typography>
                    {
                      this.state.edit[id]?
                        <Grid container style={{flex:1}} alignItems='center'>
                        <Typography variant="subtitle" style={{flex:0.2, verticalAlign:'center', height:'100%'}}>
                          Rp.
                        </Typography>
                        <TextField
                          inputRef={input => this['price'+id] = input}
                          id="harga"
                          defaultValue={item.price}
                          margin="normal"
                          variant="outlined"
                          style={{flex:1}}
                        />
                        <Typography variant="subtitle" style={{flex:0.2, verticalAlign:'center', height:'100%'}}>
                          / day
                        </Typography>
                        </Grid>
                        :
                        <Typography variant="subtitle1" style={{textAlign:'left', flex:0.5, marginLeft:8,padding:8}}>
                            Rp. {item.price} / day
                        </Typography>
                    }
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
                    {
                      this.state.edit[id]?
                      <Button variant='outlined' color='primary' onClick={()=>{
                        this._handleSave(item.feature,id,item.id);
                        }
                      }>
                        SAVE
                        <DoneIcon style={{fontSize:15, marginLeft:8}}/>
                      </Button>
                      :
                      <Button variant='outlined' onClick={()=>this._handleEdit(id)}>
                        EDIT
                        <EditIcon style={{fontSize:15, marginLeft:8}}/>
                      </Button>
                    }
                    {
                      this.state.edit[id]?
                      <Button style={{fontSize:15, marginLeft:8}} variant='outlined' color='secondary' onClick={()=>{this._handleCancel(id)}}>
                        CANCEL
                        <DoneIcon style={{fontSize:15, marginLeft:8}}/>
                      </Button>
                      :
                      null
                    }
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
        <Dialog open={this.state.dialog} onClose={()=>this.setState({dialog : false})}>
          <Grid style={{padding:16}}>
            <DialogTitle>New Vehicle</DialogTitle>
            <NewVehicle closeDialog={this._handleCloseDialog.bind(this)} successSubmit={this._newVehicleSuccess.bind(this)}/>
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
          open={this.state.edit_success}
          autoHideDuration={6000}
          onClose={()=>this.setState({edit_success:false})}
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

export default Vehicle;