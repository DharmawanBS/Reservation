import React, { Component } from "react";
import { Grid, Paper, Typography, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, Button, GridList, GridListTile, GridListTileBar } from "@material-ui/core";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AddIcon from '@material-ui/icons/Add';

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
      expanded : null
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
          <Grid style={{flexDirection:'row', paddingTop:16}} container>
                <GridList style={{transform:'translateZ(0)', flex:1, justifyContent:'center'}}>
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
                <Typography variant="h5" id="simple-modal-description" style={{textAlign:'left', flex:0.5, marginLeft:24}}>
                    Spesifikasi
                </Typography>
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
                <Typography variant="h5" id="simple-modal-description" style={{textAlign:'left', flex:0.5, marginLeft:24}}>
                    Harga
                </Typography>
                <Typography variant="subtitle1" id="simple-modal-description" style={{textAlign:'left', flex:0.5, marginLeft:8,padding:16}}>
                    Rp. xxx.xxx.xxx / day
                </Typography>
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
        <Button variant="fab" color="primary" aria-label="Add" style={{position:'absolute', right:'5%', bottom:'5%'}}>
            <AddIcon />
        </Button>
    </Grid>
    );
  }
}

export default Vehicle;