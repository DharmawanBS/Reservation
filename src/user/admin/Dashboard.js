import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import {Bar, Doughnut} from 'react-chartjs-2';

const dataBar = {
	labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
	datasets: [
	  {
		label: 'Reservation Count',
		backgroundColor: 'rgba(255,99,132,0.2)',
		borderColor: 'rgba(255,99,132,1)',
		borderWidth: 1,
		hoverBackgroundColor: 'rgba(255,99,132,0.4)',
		hoverBorderColor: 'rgba(255,99,132,1)',
		data: [65, 59, 80, 81, 56, 55, 40]
	  }
	]
  };

const dataDoughnut = {
	labels: [
		'Red',
		'Green',
		'Yellow'
	],
	datasets: [{
		data: [300, 50, 100],
		backgroundColor: [
		'#FF6384',
		'#36A2EB',
		'#FFCE56'
		],
		hoverBackgroundColor: [
		'#FF6384',
		'#36A2EB',
		'#FFCE56'
		]
	}]
};


const styles = {
	segment : {
		padding: 16,
		margin:8,
		minWidth: 350,
		width: '40vw'
	}
}
export default class Dashboard extends Component {

    render() {
		return(
			<Grid container style={{padding:8}} justify='space-around'>
				<Grid container justify='space-around'>
					<Grid>
						<Paper style={styles.segment}>
							<Bar
								data={dataBar}
							/>
						</Paper>
					</Grid>
					<Grid>
						<Paper style={styles.segment}>
							<Bar
								data={dataBar}
							/>
						</Paper>
					</Grid>
				</Grid>
				<Grid container justify='space-around'>
					<Grid>
						<Paper style={styles.segment}>
							<Doughnut data={dataDoughnut} />
						</Paper>
					</Grid>
					<Grid>
						<Paper style={styles.segment}>
							<Doughnut data={dataDoughnut} />
						</Paper>
					</Grid>
				</Grid>
			</Grid>
		)
	}
}