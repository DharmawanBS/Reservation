import React, { Component } from "react";
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import Zoom from '@material-ui/core/Zoom';

const styles = {
    card: {
      maxWidth: 345,
      alignSelf:'center'
    },
    media: {
      // ⚠️ object-fit is not supported by IE 11.
      objectFit: 'cover',
    },
  };

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

class Available extends Component {
    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };

    state = {
        open: false,
    };

	_handleSearch=()=>{
		this.props.history.push('/avail');
    }
    
    handleOpen = () => {
        this.setState({ open: true });
      };
    
      handleClose = () => {
        this.setState({ open: false });
      };

  render() {
    return (
    <div>
        <Grid container style={{
            justifyContent:'center',
            alignItems:'center',
            flex:1, height:'100vh',
            flexDirection:'column'
            }} >
            <Typography gutterBottom variant="h5" component="h2" style={{color:'#FFF'}}>
                            Available
            </Typography>
            <Grid container style={{justifyContent:'space-around'}}>
            <Card style={styles.card}>
            <CardActionArea>
                <CardMedia
                component="img"
                alt="Big Bus"
                className={styles.media}
                image="http://www.jakartabusrent.com/lampiran/home1.jpg"
                title="Big Bus"
                />
                <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                    Big Bus
                </Typography>
                <Typography component="p">
                    Bus dengan kapasitas 59 seat (formasi tempat duduk 2-3)
                </Typography>
                </CardContent>
            </CardActionArea>
            <CardActions>
                <Button size="small" color="primary" style={{flex:1}}>
                Detail
                </Button>
                <Button size="small" color="primary" style={{flex:1}}>
                Select
                </Button>
            </CardActions>
            </Card>


            <Card style={styles.card}>
            <CardActionArea>
                <CardMedia
                component="img"
                alt="Contemplative Reptile"
                className={styles.media}
                image="http://www.jakartabusrent.com/lampiran/home1.jpg"
                title="Contemplative Reptile"
                />
                <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                    Lizard
                </Typography>
                <Typography component="p">
                    Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging
                    across all continents except Antarctica
                </Typography>
                </CardContent>
            </CardActionArea>
            <CardActions>
                <Button size="small" color="primary" style={{flex:1}} onClick={()=>this.handleOpen()}>
                Detail
                </Button>
                <Button size="small" color="primary" style={{flex:1}}>
                Select
                </Button>
            </CardActions>
            </Card>
            </Grid>
        </Grid>
        <Modal
          style={{outline:'none'}}
          disableAutoFocus={true}
          open={this.state.open}
          onClose={this.handleClose}
        >
        <Zoom in={this.state.open} style={{ transitionDelay:0}}>
          <Paper style={{textAlign:'center', padding:16, top:'10%', position:'fixed', marginLeft:'15%', marginRight:'15%'}}>
            <Typography variant="h6" id="modal-title">
              Big Bus
            </Typography>
            <Grid style={{flexDirection:'row', paddingTop:16}} container>
                <GridList cols={2.5} style={{transform:'translateZ(0)', flex:1, justifyContent:'center', height:'50vw'}}>
                    {tileData.map(tile => (
                    <GridListTile key={tile.img}>
                        <img src={tile.img} alt={tile.title} />
                        <GridListTileBar
                        title={tile.title}
                        />
                    </GridListTile>
                    ))}
                </GridList>
                <Typography variant="subtitle1" id="simple-modal-description" style={{textAlign:'left', flex:0.5, marginLeft:8, padding:16}}>
                    SPESIFIKASI : <br />
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
            </Grid>
          </Paper>
          </Zoom>
        </Modal>
      </div>
    );
  }
}

export default Available;