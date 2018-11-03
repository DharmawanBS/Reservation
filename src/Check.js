import React, { Component } from "react";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

var date = new Date();

const styles = {
	root: {
		padding: 8,
		paddingLeft: 40,
		paddingRight: 40,
		width: '70vw'
	},
	textField: {
		//marginLeft: 8,
		//marginRight: 8,
		marginTop: 16,
		marginBottom: 16
	},
	dense: {
		marginTop: 19,
	},
	container: {
		display: 'flex',
		flexWrap: 'wrap',
	},
	title: {
		textAlign: 'center'
	},
	formControl: {
		minWidth: '100%',
		marginBottom: 8,
		marginTop: 8
	},
	selectEmpty: {
		marginTop: 16,
	},
};


class Check extends Component {
    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };

    state = {};

	_handleSearch=()=>{
		this.props.history.push('/available');
	}
  render() {
    return (
    <div>
        <Grid container style={{flex:1, position:'fixed', top:'30%', padding:16}}>
			<Typography variant="h3" component="h3" style={{flex:1, color:'#FFF', textAlign:'left', verticalAlign:'center', alignSelf:'center'}}>
			LAYANAN SEWA BUS PARIWISATA JAKARTA TERBAIK DAN TEPERCAYA
			</Typography>
            <Paper elevation={10} style={{
				flex:1,
				padding:16,
                textAlign:'center'}}>
                <Typography variant="h5" component="h3">
                    Book Now
                </Typography>
                <form>
                    <TextField
                        id="location"
                        label="Lokasi Tujuan"
                        fullWidth
                        style={[styles.textField, styles.dense]}
                        margin="dense"
                        variant="outlined"
                    />
                    <TextField
							id="start-date"
							label="Tanggal Berangkat"
							type="date"
							defaultValue={this.state.dateNow}
							style={styles.textField}
							InputLabelProps={{
							shrink: true,
							}}
							fullWidth
                    />
                    <TextField
							id="end-date"
							label="Tanggal Kembali"
							type="date"
							defaultValue={this.state.dateNow}
							style={styles.textField}
							InputLabelProps={{
							shrink: true,
							}}
							fullWidth
                    />
                    <TextField
                        id="location"
                        label="Jumlah penumpang"
                        fullWidth
                        style={[styles.textField, styles.dense]}
                        margin="dense"
                        variant="outlined"
                    />
                    <div style={{textAlign:'right'}} onClick={()=>this._handleSearch()}>
                        <Button size="large" variant='contained' color='primary' style={{marginTop:8, textAlign:'right'}}>
                            Search
                        </Button>
                    </div>
                </form>
            </Paper>
        </Grid>
      </div>
    );
  }
}

export default Check;