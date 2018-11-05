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
      alignSelf:'center',
      margin:8
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
        lightboxIsOpen : false
    };
    
    handleOpen = () => {
        this.setState({ open: true });
      };
    
      handleClose = () => {
        this.setState({ open: false });
      };

  render() {
    return (
        <Grid container style={{
            justifyContent:'center',
            alignItems:'center',
            flex:1, height:'100vh',
            flexDirection:'column'
            }} >
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
                <Button size="small" color="primary" style={{flex:1}} onClick={()=>this.handleOpen()}>
                    Detail
                </Button>
                <Button size="small" color="primary" style={{flex:1}} onClick={()=>this.props.history.push("/user/booking detail")}>
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
                    Big Bus 2
                </Typography>
                <Typography component="p">
                    Bus dengan kapasitas 60 seat (formasi tempat duduk 2-3)
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
        
        <Modal
          style={{outline:'none'}}
          disableAutoFocus={true}
          open={this.state.open}
          onClose={this.handleClose}
        >
        <Zoom in={this.state.open} style={{ transitionDelay:0}}>
        <Grid container justify='center' alignItems='center' style={{height:'100%'}}>
          <Paper style={{textAlign:'center', padding:16, width:800}}>
            <Typography variant="h6" id="modal-title">
              Big Bus
            </Typography>
            <Grid style={{flexDirection:'row', paddingTop:16}} container>
                <GridList cols={2.5} style={{transform:'translateZ(0)', flex:1, justifyContent:'center', height:450}}>
                    {tileData.map(tile => (
                    <GridListTile key={tile.img}>
                        <img src={tile.img} alt={tile.title} />
                        <GridListTileBar
                        title={tile.title}
                        />
                    </GridListTile>
                    ))}
                </GridList>
                <Grid>
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
                <Grid>
                    <Button variant='contained' color='secondary' style={{marginRight:16}} onClick={()=>this.handleClose()}>
                        Close
                    </Button>
                    <Button variant='contained' color='primary' style={{flex:1}} onClick={()=>this.props.history.push('/user/booking detail')}>
                        Select
                    </Button>
                </Grid>
                </Grid>
            </Grid>
          </Paper>
        </Grid>
          </Zoom>
        </Modal>
        </Grid>
    );
  }
}

export default Available;