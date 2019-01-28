import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import {Bar, Doughnut, Line} from 'react-chartjs-2';


const  mL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

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

	state = {
		unique_user : [],
		thisYear : {},
		prevYear : {},
		total_income : [],
		transaction_success : []
	}

	componentDidMount(){
		fetch('http://www.api.jakartabusrent.com/index.php/dashboard/index',{
		  method : 'POST',
		  body : {
			  year : '2019'
		  }
		}).then(response => response.json())
		.then(responseJSON => {
		  console.log(JSON.stringify(responseJSON.data))
		  if(responseJSON.msg.toLowerCase() === 'ok'){
			let thisYear = responseJSON.data.this_year;
			let prevYear = responseJSON.data.prev_year;
			let per_month = responseJSON.data.per_month;
			console.log('test ' + per_month.transaction_success);
			this.setState({
			  unique_user : this.buildData(per_month.unique_user),
			  transaction_success : this.buildData(per_month.transaction_success),
				total_income : this.buildData(per_month.total_income),
				thisYear,
				prevYear
			});
		  }
		})
	}

	buildData(raw){
		let temp = []
		raw.forEach(element => {
			temp.push(element.count)
		});
		return temp;
	}

		convertToRupiah=(angka)=>{
			var rupiah = '';		
			var angkarev = angka.toString().split('').reverse().join('');
			for(var i = 0; i < angkarev.length; i++) if(i%3 == 0) rupiah += angkarev.substr(i,3)+'.';
			return 'Rp. '+rupiah.split('',rupiah.length-1).reverse().join('');
		}

    render() {
		const uniqueUserData = {
			labels: mL,
			datasets : [
			  {
				label: 'Reservation Count',
				backgroundColor: 'rgba(255,99,132,0.2)',
				borderColor: 'rgba(255,99,132,1)',
				borderWidth: 1,
				hoverBackgroundColor: 'rgba(255,99,132,0.4)',
				hoverBorderColor: 'rgba(255,99,132,1)',
				data: this.state.unique_user
			  }
			]
			};
		const incomeData ={
			labels: mL,
			datasets : [
			  {
				label: 'Income',
				backgroundColor: 'rgba(255,0,0,0.2)',
				borderColor: 'rgba(255,0,0,1)',
				borderWidth: 1,
				hoverBackgroundColor: 'rgba(255,0,0,0.4)',
				hoverBorderColor: 'rgba(255,0,0,1)',
				data: this.state.total_income
			  }
			]
		};
		const transactionData ={
			labels: mL,
			datasets : [
			  {
				label: 'Transaction Success',
				backgroundColor: 'rgba(255,0,0,0.2)',
				borderColor: 'rgba(255,0,0,1)',
				borderWidth: 1,
				hoverBackgroundColor: 'rgba(255,0,0,0.4)',
				hoverBorderColor: 'rgba(255,0,0,1)',
				data: this.state.transaction_success
			  }
			]
		};
		return(
			<Grid style={{padding:8}} justify='space-around'>
				<Grid container style={{flex:1}}>
					<Grid justify='space-around'>
						<Paper style={styles.segment}>
								<Typography variant='h6'>
									Total Income : 
								</Typography>
								<Typography variant='subtitle1'>
									{this.convertToRupiah(this.state.thisYear.total_income+'')} (this year) / {this.convertToRupiah(this.state.prevYear.total_income+'')} (last year)
								</Typography>
						</Paper>
					</Grid>

					<Grid justify='space-around'>
						<Paper style={styles.segment}>
								<Typography variant='h6'>
									Transaction Success : 
								</Typography>
								<Typography variant='subtitle1'>
									{this.state.thisYear.transaction_success} (this year) / {this.state.prevYear.transaction_success} (last year)
								</Typography>
						</Paper>
					</Grid>
					
				</Grid>
				<Grid container style={{flex:1}}>

					<Grid justify='space-around'>
						<Paper style={styles.segment}>
						<Typography variant='h6'>
								Unique User : 
							</Typography>
							<Typography variant='subtitle1'>
								{this.state.thisYear.unique_user} (this year) / {this.state.prevYear.unique_user} (last year)
							</Typography>
						</Paper>
					</Grid>
					
				</Grid>
				<Grid container justify='space-around' style={{flex:1}}>
					<Grid>
						<Paper style={styles.segment}>
							<Bar
								data={incomeData}
							/>
						</Paper>
					</Grid>
					<Grid>
						<Paper style={styles.segment}>
							<Bar
								data={transactionData}
							/>
						</Paper>
					</Grid>
				</Grid>

				<Grid>
						<Paper style={styles.segment}>
							<Bar
								data={uniqueUserData}
							/>
						</Paper>
					</Grid>
			</Grid>
		)
	}
}