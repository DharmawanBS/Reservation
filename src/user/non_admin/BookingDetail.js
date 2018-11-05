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


class BookingDetail extends Component {
    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };

    state = {
        dateNow : date
    };

	_handleSearch=()=>{
		this.props.history.push('/available');
	}
  render() {
    return (
    <div style={{flex:1, height:'100%'}}>
        <Grid container style={{flex:1, padding:16, height:'100%'}} justify='center' alignItems='center'>
            <Paper elevation={10} style={{
				padding:16,
                width:500,
                textAlign:'center'}}>
                <Typography variant="h5" component="h3">
                    Booking Detail
                </Typography>
                <form>
                    <TextField
                        id="location"
                        label="Lokasi Tujuan"
                        fullWidth
                        style={[styles.textField, styles.dense]}
                        margin="dense"
                        variant="outlined"
                        value="Nama tempat"
                    />
                    <TextField
							id="start-date"
							label="Tanggal Berangkat"
							type="date"
							defaultValue='2017-05-24'
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
							defaultValue='2017-05-28'
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
                        value = '50'
                    />
                    <TextField
                        id="location"
                        label="Tipe Bus"
                        fullWidth
                        style={[styles.textField, styles.dense]}
                        margin="dense"
                        variant="outlined"
                        value = 'Big Bus'
                    />
                    <TextField
                        id="location"
                        label="Estimasi Harga"
                        fullWidth
                        style={[styles.textField, styles.dense]}
                        margin="dense"
                        variant="outlined"
                        value = 'Rp. xxx.xxx.xxx'
                    />
                    <div style={{textAlign:'right'}}>
                        <Button size="large" variant='contained' color='secondary' style={{marginTop:8, textAlign:'right', marginRight:8}}>
                            Ganti Bus
                        </Button>
                        <Button size="large" variant='contained' color='primary' style={{marginTop:8, textAlign:'right'}}>
                            Pesan
                        </Button>
                    </div>
                </form>
            </Paper>
        </Grid>
      </div>
    );
  }
}

export default BookingDetail;