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

//icons
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/DeleteOutline';
import EditIcon from '@material-ui/icons/Edit';
import DoneIcon from '@material-ui/icons/Done';
import NewVehicle from "./NewVehicle";

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
      edit : false,
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
      price : '10000000'
  };

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

  _handleOpenDialogDelete=()=>{
    this.setState({dialogDelete:true})
  }

  _handleDeleteSpec=(ids)=>{
    let arr = [...this.state.spec];
    console.log(arr.splice(ids,1));
    this.setState({
      spec : arr
    })
    let len = arr.length;
    for(let x=0; x<len; x++){
      this['spec'+x].value = arr[x];
    }
    console.log(this.state.spec[ids] + ' ' + ids)
  }

  _handleEdit=()=>{
    this.setState({
      edit : true,
      oldSpec : this.state.spec
    })
  }

  _handleSave=()=>{
    let len = this.state.spec.length;
    var arr = []
    for(let x=0; x<len; x++){
      arr.push(this['spec'+x].value);
    }
    this.setState({
      spec : arr,
      edit : false
    })
    console.log(arr.toString());
  }

  render() {
      const {expanded} = this.state;
    return (
    <Grid container justify='center' alignItems='center' style={{flex:1, height:'80', padding:16}}>
        <Paper style={{padding:16, textAlign:'center'}}>
        <ExpansionPanel expanded={expanded === 'panel1'} onChange={this.handleChange('panel1')}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant='h5'>Big Bus T 35 T</Typography>
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
                          this.state.edit?
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
                    Spesifikasi
                </Typography>
                <Grid style={{overflow:'auto', maxHeight:500, overflowX:'hidden'}}>
                {
                  !this.state.edit?
                    this.state.spec.map((item,id)=>(
                      <Grid container style={{textAlign:'left', flex:1, marginLeft:8,padding:8,fontWeight:'normal'}}>
                      <Typography variant='subheading' style={{verticalAlign:'center'}}>
                        {item}
                      </Typography>
                      </Grid>
                    ))
                  :
                  <Grid>
                  {this.state.spec.map((item, id)=>(
                    <Grid container>
                    <TextField
                      inputRef={(input)=>{this['spec'+id] = input}}
                      defaultValue={item}
                      margin="normal"
                      variant="outlined"
                      style={{flex:1}}
                    />
                     <IconButton style={{flex:0.2}} onClick={()=>this._handleDeleteSpec(id)}>
                        <DeleteIcon fontSize='12px'/>
                      </IconButton>
                    </Grid>
                  ))}
                  <Button onClick={()=>{
                    this.state.spec.push("")
                    this.setState({spec:this.state.spec})
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
                  this.state.edit?
                    <Grid container style={{flex:1}} alignItems='center'>
                    <Typography variant="subtitle" style={{flex:0.2, verticalAlign:'center', height:'100%'}}>
                      Rp.
                    </Typography>
                    <TextField
                      id="harga"
                      value={this.state.price}
                      margin="normal"
                      variant="outlined"
                      onChange={(e)=>this.setState({price : e.target.value})}
                      style={{flex:1}}
                    />
                    <Typography variant="subtitle" style={{flex:0.2, verticalAlign:'center', height:'100%'}}>
                      / day
                    </Typography>
                    </Grid>
                    :
                    <Typography variant="subtitle1" style={{textAlign:'left', flex:0.5, marginLeft:8,padding:8}}>
                        Rp. {this.state.price} / day
                    </Typography>
                }
                </Grid>
              </Grid>
              <Grid style={{textAlign:'right', marginTop:8}}>
                <Button variant='contained' color='secondary'
                onClick={()=>this._handleOpenDialogDelete()}
                style={{marginRight:16}}>
                    Delete
                    <DeleteIcon style={{fontSize:15, marginLeft:8}}/>
                  </Button>
                  <Dialog
                      open={this.state.dialogDelete}
                      onClose={()=>this._handleCloseDialogDelete()}
                    >
                      <DialogTitle id="alert-dialog-title">{"Delete this vehicle data?"}</DialogTitle>
                      <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                        Deleting this data means you can not access this vehicle's data anymore..
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={()=>this._handleCloseDialogDelete()} color="primary">
                          Disagree
                        </Button>
                        <Button onClick={()=>this._handleCloseDialogDelete()} color="primary" autoFocus>
                          Agree
                        </Button>
                      </DialogActions>
                    </Dialog>
                {
                  this.state.edit?
                  <Button variant='outlined' color='primary' onClick={()=>{
                    this._handleSave()
                    }
                  }>
                    SAVE
                    <DoneIcon style={{fontSize:15, marginLeft:8}}/>
                  </Button>
                  :
                  <Button variant='outlined' onClick={()=>this._handleEdit()}>
                    EDIT
                    <EditIcon style={{fontSize:15, marginLeft:8}}/>
                  </Button>
                }
                {
                  this.state.edit?
                  <Button style={{fontSize:15, marginLeft:8}} variant='outlined' color='secondary' onClick={()=>{
                    this.setState({edit:false, spec:this.state.oldSpec})
                    console.log('clicked')
                    }
                  }>
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
        
        <ExpansionPanel expanded={expanded === 'panel2'} onChange={this.handleChange('panel2')}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant='h5'>General settings</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Typography>
              Nulla facilisi. Phasellusm quam.
            </Typography>
          </ExpansionPanelDetails> sollicitudin nulla et quam mattis feugiat. Aliquam eget
              maximus est, id dignissi
        </ExpansionPanel>
        </Paper>
        <Button variant="fab" color="primary" aria-label="Add" style={{position:'fixed', right:'5%', bottom:'5%'}} onClick={()=>this.setState({dialog:true})}>
            <AddIcon />
        </Button>
        <Dialog open={this.state.dialog} onClose={()=>this.setState({dialog : false})}>
          <Grid style={{padding:16}}>
            <DialogTitle>New Vehicle</DialogTitle>
            <NewVehicle closeDialog={this._handleCloseDialog.bind(this)}/>
          </Grid>
        </Dialog>
    </Grid>
    );
  }
}

export default Vehicle;