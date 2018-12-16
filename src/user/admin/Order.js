//core
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
import Tooltip from '@material-ui/core/Tooltip';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import InputAdornment from '@material-ui/core/InputAdornment';
import moment from 'moment';

//styles
import { withStyles } from '@material-ui/core/styles';

//icons
import DeleteIcon from '@material-ui/icons/Delete';
import CreateIcon from '@material-ui/icons/Create';
import SaveIcon from '@material-ui/icons/Save';
import AddIcon from '@material-ui/icons/Add';
import BlockIcon from '@material-ui/icons/Block';
import ClearIcon from '@material-ui/icons/Clear';

//var
var date = moment(date).format();
var util = require('util')

function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
  return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

const rows = [
    { id: 'id', numeric: false, disablePadding: false, label: 'ID' },
    { id: 'booking', numeric: false, disablePadding: false, label: 'Booking Number' },
    { id: 'name', numeric: false, disablePadding: false, label: 'Client Name' },
    { id: 'start', numeric: false, disablePadding: false, label: 'Start Date' },
    { id: 'end', numeric: false, disablePadding: false, label: 'End Date' },
    { id: 'price', numeric: false, disablePadding: false, label: 'Price' },
];

class EnhancedTableHead extends React.Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const { order, orderBy } = this.props;

    return (
      <TableHead style={{backgroundColor: '#1565c0'}}>
        <TableRow>
          {rows.map(row => {
            return (
              <TableCell
                key={row.id}
                numeric={row.numeric}
                padding={row.disablePadding ? 'none' : 'default'}
                sortDirection={orderBy === row.id ? order : false}
              >
                <Tooltip
                  title="Sort"
                  placement={row.numeric ? 'bottom-end' : 'bottom-start'}
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={orderBy === row.id}
                    direction={order}
                    onClick={this.createSortHandler(row.id)}
                    style={{color: 'white'}}
                  >
                    {row.label}
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
            );
          }, this)}
        </TableRow>
      </TableHead>
    );
  }
}

EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
};

const toolbarStyles = theme => ({
  root: {
    paddingRight: theme.spacing.unit,
  },
  title: {
    flex: '0 0 auto',
  },
});

let EnhancedTableToolbar = props => {
  const { classes } = props;
  return (
    <Toolbar
      className={classes.root}
    >
      <div className={classes.title}>
        <Typography variant="h6" id="tableTitle">
            List Orders
        </Typography>
      </div>
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
};

EnhancedTableToolbar = withStyles(toolbarStyles)(EnhancedTableToolbar);

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
  },
  table: {
    minWidth: 1020,
  },
  tableWrapper: {
    overflowX: 'auto',
    padding: 16,
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
  textField: {
		marginTop: theme.spacing.unit,
		marginBottom: theme.spacing.unit
	},
	dense: {
		marginTop: theme.spacing.unit,
  },
  addButtonBottom: {
    position: 'fixed',
    bottom: '1vh',
    right: '2vw'
  },
  divRoot: {
    paddingBottom: '5vh',
  },
  button: {
    marginRight: theme.spacing.unit,
  }
});

class Order extends Component {
  state = {
    order: 'asc',
    orderBy: 'num',
    page: 0,
    rowsPerPage: 5,
    open: false,
    scroll: 'paper',
    dialogData: [],
    openDelete: false,
    edit: false,
    openAdd: false,
    data: [],
    idVehicle: '',
    vehicleData: [],
    userVehicleData: [],
    start_date : '',
		end_date : '',
  };

  handleChangeTextbox = name => event => {
		this.setState({
		  [name]: event.target.value,
		});
	  };

	handleChange = name => event => {
		this.setState({
			[name]: event.target.value,
		});
		if(name === 'busType'){
			var result = this.state.vehicleData.filter(obj => {
				return obj.id === event.target.value
			  })
			  var mult = 1;
			  if(this['client_start_date'].value !== '' && this['client_finish_date'].value !== ''){
				let a = this['client_start_date'].value.split('T')[0], b = this['client_finish_date'].value.split('T')[0];
				  mult = this.dateDiffInDays(new Date(a),new Date(b));
			  }
			  this.setState({
				  price : result[0].price * mult
			  })
		}
	};

	dateDiffInDays(a, b) {
		const _MS_PER_DAY = 1000 * 60 * 60 * 24;
		// Discard the time and time-zone information.
		const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
		const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
	  
		return Math.floor((utc2 - utc1) / _MS_PER_DAY);
    }
    
  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    this.setState({ order, orderBy });
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  handleClickOpen = (scroll,num) => () => {
    fetch('http://www.api.jakartabusrent.com/index.php/reservasi/read',{
      method : 'POST',
      body : JSON.stringify({id: num})
		}).then(response => response.json())
		.then(responseJSON => {
		  console.log(JSON.stringify(responseJSON.data))
		  let arr = [];
		  if(responseJSON.msg.toLowerCase() === 'ok'){
			this.setState({
        dialogData : responseJSON.data[0],
        idVehicle : responseJSON.data[0].vehicle,
        open: true, 
        scroll
			});
		  }
    });
    fetch('http://www.api.jakartabusrent.com/index.php/Vehicle/read',{
      method : 'POST',
      body : JSON.stringify({id: this.state.idVehicle})
		}).then(response => response.json())
		.then(responseJSON => {
		  console.log(JSON.stringify(responseJSON.data))
		  let arr = [];
		  if(responseJSON.msg.toLowerCase() === 'ok'){
			this.setState({
        userVehicleData : responseJSON.data[0],
			});
		  }
    });
  };

  handleClose = () => {
    this.setState({ open: false }, () => { this.setState({ edit: false })});
  };

  handleEdit = () => {
    this.setState({ edit: true });
  };

  handleClickCancel = () => {
    this.setState({ edit: false});
  };

  handleClickOpenDelete = () => {
    this.setState({ openDelete: true, open: false, edit: false});
  };

  handleCloseDelete = () => {
    this.setState({ openDelete: false, edit: false });
  };

  handleOpenAdd = (text) => {
    this.props.history.replace('/admin/' + text);
  }

  fetchData=()=>{
    //get list all reservasi
    fetch('http://www.api.jakartabusrent.com/index.php/reservasi/read',{
		  method : 'POST'
		}).then(response => response.json())
		.then(responseJSON => {
		  console.log(JSON.stringify(responseJSON.data))
		  let arr = [];
		  if(responseJSON.msg.toLowerCase() === 'ok'){
			this.setState({
			  data : responseJSON.data
			});
		  }
    });
    
    //get list all vehicle
    fetch('http://www.api.jakartabusrent.com/index.php/Vehicle/read',{
		  method : 'POST'
		}).then(response => response.json())
		.then(responseJSON => {
		  console.log(JSON.stringify(responseJSON.data))
		  let arr = [];
		  if(responseJSON.msg.toLowerCase() === 'ok'){
			this.setState({
			  vehicleData : responseJSON.data
			});
		  }
		})
  }
  
  dateChecker=()=>{
		let start = moment(this.state.start_date);
		let end = moment(this.state.end_date);
		return start.isBefore(end);
  }
  
  dateFormatter=(date)=>{
		return date.replace('T', ' ');
	}

	componentDidMount(){
		this.fetchData();
	}

  render() {
    const { classes } = this.props;
    const { data, order, orderBy, rowsPerPage, page } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

    return (
      <Grid className={classes.divRoot} xl={12} xs={12} sm={12} md={12} lg={12}>
        <Paper className={classes.root}>
          <EnhancedTableToolbar/>
          <div className={classes.tableWrapper}>
            <Table className={classes.table} aria-labelledby="tableTitle">
              <EnhancedTableHead
                order={order}
                orderBy={orderBy}
                onRequestSort={this.handleRequestSort}
              />
              <TableBody>
                {stableSort(data, getSorting(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map(n => {
                    return (
                      <TableRow
                        hover
                        key={n.id}
                        padding= 'default'
                        onClick={this.handleClickOpen('paper',n.id)}
                      >
                        <TableCell component="th" scope="row" padding="default">
                          {n.id}
                        </TableCell>
                        <TableCell>{n.booking}</TableCell>
                        <TableCell>{n.name}</TableCell>
                        <TableCell>{n.start}</TableCell>
                        <TableCell>{n.end}</TableCell>
                        <TableCell>{n.price}</TableCell>
                      </TableRow>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 49 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <TablePagination
            component="div"
            count={data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            backIconButtonProps={{
              'aria-label': 'Previous Page',
            }}
            nextIconButtonProps={{
              'aria-label': 'Next Page',
            }}
            onChangePage={this.handleChangePage}
            onChangeRowsPerPage={this.handleChangeRowsPerPage}
          />
          <Dialog
            open={this.state.open}
            onClose={this.handleClose}
            scroll={this.state.scroll}
            aria-labelledby="scroll-dialog-title"
          >
            <DialogTitle id="scroll-dialog-title">Reservation Data</DialogTitle>
            <DialogContent style={{minWidth: '30vw'}}>
              <DialogContentText>
                {
                  ! this.state.edit ? (
                    <List>
                      <ListItem>
                        <ListItemText primary="ID" secondary={this.state.dialogData.id} />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="Booking Number" secondary={this.state.dialogData.booking} />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="Client Name" secondary={this.state.dialogData.name} />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="Client Phone Number" secondary={this.state.dialogData.phone} />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="Destination" secondary={this.state.dialogData.destination} />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="Pickup Location" secondary={this.state.dialogData.pick_up_location} />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="Notes" secondary={this.state.dialogData.notes} />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="Vehicle" secondary={this.state.userVehicleData.type} />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="Vehicle Number" secondary={this.state.dialogData.number} />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="Start Date" secondary={this.state.dialogData.start} />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="End Date" secondary={this.state.dialogData.end} />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="Price" secondary={this.state.dialogData.price} />
                      </ListItem>
                    </List>
                  ) : (
                    <form>
                      <TextField
                        inputRef = {(input) => this['client_name'] = input}
                        label="Client Name"
                        fullWidth
                        style={[styles.textField, styles.dense]}
                        defaultValue={this.state.dialogData.name}
                        margin="dense"
                        variant="outlined"
                        disabled={this.state.loading}
                      />
                      <TextField
                        inputRef = {(input) => this['client_phone'] = input}
                        label="Client Phone Number"
                        fullWidth
                        style={[styles.textField, styles.dense]}
                        defaultValue={this.state.dialogData.phone}
                        margin="dense"
                        variant="outlined"
                      />
                      <TextField
                        inputRef = {(input) => this['client_destination'] = input}
                        label="Destination"
                        multiline
                        rowsMax="4"
                        style={styles.textField}
                        defaultValue={this.state.dialogData.destination}
                        margin="normal"
                        variant="outlined"
                        fullWidth
                      />
                      <TextField
                        inputRef = {(input) => this['client_pick_up'] = input}
                        label="Pick Up Location"
                        multiline
                        rowsMax="4"
                        style={styles.textField}
                        defaultValue={this.state.dialogData.pick_up_location}
                        margin="normal"
                        variant="outlined"
                        fullWidth
                      />
                      <TextField
                        inputRef = {(input) => this['client_start_date'] = input}
                        defaultValue={(this.state.dialogData.start + '').split('+')[0].slice(0,-3)}
                        value={this.state.start_date}
                        onChange={(e)=>{
                          this.setState({start_date : e.target.value},()=>{
                            if(!this.dateChecker()){
                            this.setState({end_date : this.state.start_date})
                          }
                          })
                        }}
                        label="Starting Date"
                        type="datetime-local"
                        style={styles.textField}
                        InputLabelProps={{
                        shrink: true,
                        }}
                        fullWidth
                      />
                      <TextField
                        label="End Date"
                        inputRef = {(input) => this['client_finish_date'] = input}
                        defaultValue={(this.state.dialogData.end + '').split('+')[0].slice(0,-3)}
                        value={this.state.end_date}
                        onChange={(e)=>{
                          this.setState({end_date : e.target.value},()=>{
                            if(!this.dateChecker()){
                            this.setState({start_date: this.state.end_date})
                          }
                          })
                        }}
                        type="datetime-local"
                        style={styles.textField}
                        InputLabelProps={{
                        shrink: true,
                        }}
                        fullWidth
                      />
                      <TextField
                        inputRef = {(input) => this['client_bus_type'] = input}
                        select
                        label="Bus Type"
                        style={styles.textField}
                        value={this.state.busType}
                        onChange={this.handleChange('busType')}
                        SelectProps={{
                          MenuProps: {
                          
                          },
                        }}
                        margin="normal"
                        variant="outlined"
                        fullWidth
                      >
                        {this.state.vehicleData.map(option => (
                          <MenuItem key={option.id} value={option.id}>
                          {option.type} {option.number}
                          </MenuItem>
                        ))}
                      </TextField>
                      <TextField
                        disabled={this.state.loading}
                        inputRef = {(input) => this['client_notes'] = input}
                        label="Notes"
                        multiline
                        rowsMax="4"
                        style={styles.textField}
                        defaultValue={this.state.dialogData.notes}
                        margin="normal"
                        variant="outlined"
                        fullWidth
                      />
                      <TextField
                        inputRef = {(input) => this['price'] = input}
                        style={[styles.dense, styles.textField]}
                        variant="outlined"
                        label="Price"
                        value={this.state.price}
                        defaultValue={this.state.dialogData.price}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">IDR</InputAdornment>,
                        }}
                        fullWidth
                        type='Number'
                      />
                    </form>
                  )
                }
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              {
                ! this.state.edit ? (
                  <div>
                    <Button onClick={this.handleEdit} color="primary" variant="contained" className={classes.button}>
                      Deactivate
                      <BlockIcon className={classes.rightIcon}/>
                    </Button>
                    <Button onClick={this.handleEdit} color="primary" variant="contained" className={classes.button}>
                      Edit
                      <CreateIcon className={classes.rightIcon}/>
                    </Button>
                    <Button onClick={this.handleClickOpenDelete} color="secondary" variant="contained" className={classes.button}>
                      Delete
                      <DeleteIcon className={classes.rightIcon} />
                    </Button>
                  </div>
                ) : (
                  <div>
                    <Button variant="contained" color="primary" onClick={this.handleClose} className={classes.button}>
                      Save
                      <SaveIcon style={styles.rightIcon} />
                    </Button>
                    <Button onClick={this.handleClickCancel} color="secondary" variant="contained" className={classes.button}>
                      Cancel
                      <ClearIcon style={styles.rightIcon} />
                    </Button>
                  </div>
                )
              }
            </DialogActions>
          </Dialog>
          <Dialog
            open={this.state.openDelete}
            onClose={this.handleCloseDelete}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">Are you sure you want to delete record {this.state.dialogData.name} ?</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Deleting this record means you can not access this record's data anymore.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleCloseDelete} color="primary" className={classes.button}>
                Disagree
              </Button>
              <Button onClick={this.handleCloseDelete} color="primary" className={classes.button}>
                Agree
              </Button>
            </DialogActions>
          </Dialog>
          <div>
            <Button variant="fab" color="primary" aria-label="Add" className={classes.addButtonBottom} onClick={()=>{this.handleOpenAdd('reservation')}}>
              <AddIcon />
            </Button>
          </div>
        </Paper>
      </Grid>
    );
  }
}

Order.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Order);