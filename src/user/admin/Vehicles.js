import React, { Component } from "react";
import { Grid, Paper, Typography, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, Button, GridList, GridListTile, GridListTileBar, IconButton, TextField } from "@material-ui/core";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/DeleteOutline';
import EditIcon from '@material-ui/icons/Edit';
import DoneIcon from '@material-ui/icons/Done';

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
      ]
  };

  handleChange = panel => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false,
    });
  };

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
                  this.state.spec.map((item)=>(
                    <TextField
                      id="outlined-name"
                      value={item}
                      onChange={this.handleChange('name')}
                      margin="normal"
                      variant="outlined"
                      style={{width:'100%'}}
                      onSubmit={()=>{
                        this.state.spec.push("")
                          this.setState({spec:this.state.spec})
                      }}
                    />
                  ))
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
                {
                  this.state.edit?
                  <Button variant='outlined' color='primary' onClick={()=>this.setState({edit:false})}>
                    SAVE
                    <DoneIcon style={{fontSize:15, marginLeft:8}}/>
                  </Button>
                  :
                  <Button variant='outlined' onClick={()=>this.setState({edit:true})}>
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
              Nulla facilisi. Phasellus sollicitudin nulla et quam mattis feugiat. Aliquam eget
              maximus est, id dignissim quam.
            </Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        </Paper>
        <Button variant="fab" color="primary" aria-label="Add" style={{position:'fixed', right:'5%', bottom:'5%'}}>
            <AddIcon />
        </Button>
    </Grid>
    );
  }
}

export default Vehicle;