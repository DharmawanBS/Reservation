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
        "- Air Conditioner <br />",
        "- Mic <br />",
        "- TV <br />",
        "- DVD <br />",
        "- Karaoke <br />",
        "- cool box <br />",
        "- crew yg berpengalaman <br />",
        "- helper yg ramah <br />"
      ],
      dialog : false,
      dialogDelete : false
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
    }, ()=>{console.log('TEST ' + this.state.spec)}
    );
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
                <Typography variant="h5" id="simple-modal-description" style={{textAlign:'left', flex:0.5, marginLeft:24}}>
                    Spesifikasi
                </Typography>
                <Grid style={{overflow:'auto', maxHeight:500}}>
                {
                  !this.state.edit?
                    <Typography variant='subheading' id="simple-modal-description" style={{textAlign:'left', flex:0.5, marginLeft:8,padding:16, fontWeight:'normal'}}>
                      - Jumlah kursi 59 seat <br />
                      - Air Conditioner <br />
                      - Mic <br />
                      - TV <br />
                      - DVD <br />
                      - Karaoke <br />
                      - cool box <br />
                      - crew yg berpengalaman <br />
                      - helper yg ramah <br />
                  </Typography>
                  :
                  <Grid>
                  {this.state.spec.map((item, id)=>(
                    <TextField
                      id="outlined-name"
                      value={item}
                      margin="normal"
                      variant="outlined"
                      onChange={(e)=>this._handleTextFieldChange(e,id)}
                      style={{width:'100%'}}
                    />
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
                <Typography variant="h5" id="simple-modal-description" style={{textAlign:'left', flex:0.5, marginLeft:24}}>
                    Harga
                </Typography>
                <Typography variant="subtitle1" id="simple-modal-description" style={{textAlign:'left', flex:0.5, marginLeft:8,padding:16}}>
                    Rp. xxx.xxx.xxx / day
                </Typography>
                </Grid>
              </Grid>
              <Grid style={{textAlign:'right'}}>
                <Button variant='contained' color='secondary'
                onClick={()=>this._handleOpenDialogDelete()}
                style={{marginRight:16}}>
                    Delete
                    <EditIcon style={{fontSize:15, marginLeft:8}}/>
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
                  <Button variant='outlined' color='primary' onClick={()=>{this.setState({edit:false})}}>
                    SAVE
                    <DoneIcon style={{fontSize:15, marginLeft:8}}/>
                  </Button>
                  :
                  <Button variant='outlined' onClick={()=>{
                    this.setState({edit:true})
                    }}>
                    EDIT
                    <EditIcon style={{fontSize:15, marginLeft:8}}/>
                  </Button>
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