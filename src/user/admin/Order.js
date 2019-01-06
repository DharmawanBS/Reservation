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
import Grid from '@material-ui/core/Grid';
import moment from 'moment';
import Snackbar from '@material-ui/core/Snackbar';
import Cookies from 'universal-cookie';
import TextField from '@material-ui/core/TextField';

//styles
import { withStyles } from '@material-ui/core/styles';

//icons
import ClearIcon from '@material-ui/icons/Clear';
import AddIcon from '@material-ui/icons/Add';
import PrintIcon from '@material-ui/icons/Print';
import BlockIcon from '@material-ui/icons/Block';
import DoneIcon from '@material-ui/icons/Done';
import SaveIcon from '@material-ui/icons/Save';
import { isNull } from 'util';

//var
var date = moment(date).format();
var util = require('util')

function desc(a, b, orderBy) {
  return b[orderBy].localeCompare(a[orderBy],'en',{numeric:'true' ,sensitivity: 'base'});
}

function asc(a, b, orderBy) {
  return a[orderBy].localeCompare(b[orderBy],'en',{numeric:'true' ,sensitivity: 'base'});
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
  return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => asc(a, b, orderBy);
}

const rows = [
    { id: 'id', numeric: false, disablePadding: false, label: 'ID' },
    { id: 'code', numeric: false, disablePadding: false, label: 'Code Number' },
    { id: 'client_name', numeric: false, disablePadding: false, label: 'Client Name' },
    { id: 'start', numeric: false, disablePadding: false, label: 'Start Date' },
    { id: 'end', numeric: false, disablePadding: false, label: 'End Date' },
    { id: 'is_approved', numeric: false, disablePadding: false, label: 'Approved' },
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
                align='center'
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
    fontSize: theme.spacing.unit*1.5,
    marginBottom: theme.spacing.unit,
  },
  cssRoot: {
    borderRadius: theme.spacing.unit*3,
    fontSize: theme.spacing.unit*1.2
  },
  cssNormal: {
    backgroundColor:'#03a9f4',
    color: 'white',
    '&:hover' : {
      backgroundColor:'#03a9f4',
      color: 'white',
    }
  },
  cssError: {
    backgroundColor: '#b71c1c',
    color: 'white',
    '&:hover' : {
      backgroundColor: '#b71c1c',
      color: 'white',
    }
  },
  cssApproved: {
    backgroundColor:'#00e676',
    '&:hover' : {
      backgroundColor:'#00e676',
    }
  }
});

const cookie = new Cookies();

class Order extends Component {
  state = {
    order: 'asc',
    orderBy: 'id',
    page: 0,
    rowsPerPage: 5,
    open: false,
    scroll: 'paper',
    dialogData: [],
    openDelete: false,
    openAdd: false,
    data: [],
    loading : true,
    idApproval: '',
    crewList: [""],
    openApproval: false,
    dialogData: {
      crew: []
    }
  };

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
    fetch('http://www.api.jakartabusrent.com/index.php/reservation/read',{
      method : 'POST',
      body : JSON.stringify({id: num})
		}).then(response => response.json())
		.then(responseJSON => {
		  console.log(JSON.stringify(responseJSON.data))
		  let arr = [];
		  if(responseJSON.msg.toLowerCase() === 'ok'){
			this.setState({
        dialogData : responseJSON.data[0],
        open: true, 
        scroll
			});
		  }
    });
  };

  handleClose = () => {
    this.setState({ open: false });
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
    fetch('http://www.api.jakartabusrent.com/index.php/reservation/read',{
      method : 'POST',
      headers: {
        'content-type': 'application/json',
        'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
      }
		}).then(response => response.json())
		.then(responseJSON => {
		  //console.log(JSON.stringify(responseJSON.data))
		  let arr = [];
		  if(responseJSON.msg.toLowerCase() === 'ok'){
        this.setState({
          data : responseJSON.data,
          loading: false,
        });
      }
      else if (responseJSON.msg.toLowerCase() === 'empty') {
        this.setState({
          loading: false,
        });
      }
    });
  }
  
  _handleCancelButton = (id,start_date) => {
    let a = start_date, b = (date + '').split('+')[0].slice(0,-3).split('T')[0];
    var diff = this.dateDiffInDays(new Date(b),new Date(a));
    if(!(id === '')&& (diff>0)){
        if(window.confirm("Cancel this data?")){
            this._cancelPayload(id);
        }
    }else if (diff<1 && !(id === '')){
      window.alert('Can not cancel, order is in use');
      this.setState({openDelete: false});
    } else {
      window.alert('Can not cancel, please check again');
    }
  }

  dateDiffInDays(a, b) {
		const _MS_PER_DAY = 1000 * 60 * 60 * 24;
		// Discard the time and time-zone information.
		const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
		const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
	  
    var hasil =  Math.floor((utc2 - utc1) / _MS_PER_DAY);
    return hasil;
	  }

  _cancelPayload = (id) => {
    this.setState({
        loading : true
    })
    fetch('http://www.api.jakartabusrent.com/index.php/reservation/cancel',{
        method : 'POST',
        headers: {
            'content-type': 'application/json',
            'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
        },
        body : this._buildCancelPayload(id)
    }).then(response => response.json())
    .then(responseJSON =>{
        if(responseJSON.msg.toLowerCase() === 'ok'){
          this.setState({
            submit_success : true,
            loading : false,
          });
          this.handleCloseDelete();
          this.fetchData();
        }
    })
    .catch(e=>console.log(e));  
  }

  _buildCancelPayload = (id) => {
    var obj ={
      id : id,
      user : cookie.get('user_id'),
    }
    console.log(JSON.stringify(obj));
    return JSON.stringify(obj);
  }

  handleReject = (id) => {
    if(!(id === '')){
      if(window.confirm("Reject this data?")){
          this._rejectPayload(id);
      }
    }else{
        window.alert('Can not reject, please check again');
    }
  };

  _rejectPayload = (id) => {
    this.setState({
        loading : true
    })
    fetch('http://www.api.jakartabusrent.com/index.php/reservation/reject',{
        method : 'POST',
        headers: {
            'content-type': 'application/json',
            'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
        },
        body : this._buildRejectPayload(id)
    }).then(response => response.json())
    .then(responseJSON =>{
        if(responseJSON.msg.toLowerCase() === 'ok'){
          this.setState({
            submit_success : true,
            loading : false,
          });
          this.handleCloseDelete();
          this.fetchData();
        }
    })
    .catch(e=>console.log(e));  
  }

  _buildRejectPayload = (id) => {
    var obj ={
      id : id,
      user : cookie.get('user_id'),
    }
    console.log(JSON.stringify(obj));
    return JSON.stringify(obj);
  }

  handleApproval = (id) => {
    this.setState({openApproval: true, open: false, idApproval: id});
  }

  handleCloseApproval = (id) => {
    this.setState({openApproval: false, idApproval: ''});
  }

  spanNewCrew=()=>{
		let crewList = [...this.state.crewList];
		crewList.push('');
		this.setState({crewList});
	}
  
  _handleSubmitApprovalButton = () => {
    if(!(this.state.idApproval === '')){
      if(window.confirm("Approve this data?")){
          this._approvePayload(this.state.idApproval);
      }
    }else{
        window.alert('Can not approve, please check again');
    }
  };

  _approvePayload = (id) => {
    this.setState({
      loading : true
    })
    fetch('http://www.api.jakartabusrent.com/index.php/reservation/approval',{
        method : 'POST',
        headers: {
            'content-type': 'application/json',
            'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
        },
        body : this._buildApprovePayload(id)
    }).then(response => response.json())
    .then(responseJSON =>{
        if(responseJSON.msg.toLowerCase() === 'ok'){
          this.setState({
            submit_success : true,
            loading : false,
          });
          this.handleCloseApproval();
          this.fetchData();
        }
    })
    .catch(e=>console.log(e));
  }

  _buildApprovePayload = (id) => {
    var obj ={
      id : id,
      user : cookie.get('user_id'),
      crew : this.buildCrewList(),
    }
    console.log(JSON.stringify(obj));
    return JSON.stringify(obj);
  }

	buildCrewList(){
		let len = this.state.crewList.length;
		let crewList = [];
		for(let x=0; x<len; x++){
			let name = this['crewName'+x].value;
			let status = this['crewPosition'+x].value;
			crewList.push({name,status});
		}
		console.log(JSON.stringify(crewList))
		return crewList;
  }

  statusInTable = (approve,cancel) => {
    if (cancel==true) {
      return (<Button size="small" variant="contained" style={{backgroundColor: '#b71c1c',color: 'white',borderRadius: 24, fontSize: 8*1.2,}}>Canceled</Button>);
    }
    if (isNull(approve)) {
      return (<Button size="small" variant="contained" style={{backgroundColor:'#03a9f4',color: 'white',borderRadius: 24, fontSize: 8*1.2,}}>Not approved</Button>);
    } else if (approve==true) {
      return (<Button size="small" variant="contained" style={{backgroundColor:'#00e676', borderRadius: 24, fontSize: 8*1.2, }}>Approved</Button>)
    } else if (approve==false) {
      return (<Button size="small" variant="contained" style={{backgroundColor: '#b71c1c',color: 'white',borderRadius: 24, fontSize: 8*1.2,}}>Reject</Button>);
    }
  }

  componentDidMount(){
		this.fetchData();
  }
  
  handlePrintButton = (id) => {
    var win = window.open('http://www.api.jakartabusrent.com/index.php/reservation/print?id='+id, '_blank');
    win.focus();
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
                {data.length > 0 ?(stableSort(data, getSorting(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map(n => {
                    return (
                      <TableRow
                        hover
                        key={n.id}
                        padding= 'default'
                        onClick={this.handleClickOpen('paper',n.id)}
                      >
                        <TableCell>{n.id}</TableCell>
                        <TableCell>{n.code}</TableCell>
                        <TableCell>{n.client_name}</TableCell>
                        <TableCell>{n.start}</TableCell>
                        <TableCell>{n.end}</TableCell>
                        <TableCell>{this.statusInTable(n.is_approved,n.is_cancel)}</TableCell>
                      </TableRow>
                    );
                  })): (<TableRow><center><p style={{color: "#BDBDBD"}}>Data is Empty</p></center></TableRow>)}
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
                <List>
                  <ListItem>
                    <ListItemText primary="ID" secondary={this.state.dialogData.id} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Code Number" secondary={this.state.dialogData.code} />
                  </ListItem>
                  <ListItem>
                    <ListItemText style={{textTransform: 'capitalize'}} primary="Client Name" secondary={this.state.dialogData.client_name} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Client Phone Number" secondary={this.state.dialogData.client_phone} />
                  </ListItem>
                  <ListItem>
                    <ListItemText style={{textTransform: 'capitalize'}} primary="Destination" secondary={this.state.dialogData.destination} />
                  </ListItem>
                  <ListItem>
                    <ListItemText style={{textTransform: 'capitalize'}} primary="Pickup Location" secondary={this.state.dialogData.pick_up_location} />
                  </ListItem>
                  <ListItem>
                    <ListItemText style={{textTransform: 'capitalize'}} primary="Notes" secondary={this.state.dialogData.notes} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Vehicle" secondary={this.state.dialogData.vehicle_type} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Vehicle Number" secondary={this.state.dialogData.vehicle_number} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Start Date" secondary={this.state.dialogData.start} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="End Date" secondary={this.state.dialogData.end} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Price" secondary={'IDR '+this.state.dialogData.price} />
                  </ListItem>
                  {
                    this.state.dialogData.crew.map((n,id)=>(
                      <ListItem>
                        <ListItemText style={{textTransform: 'capitalize'}} primary={n.crew_status} secondary={n.crew_name} />
                      </ListItem>
                    ))
                  }
                </List>
              </DialogContentText>
            </DialogContent>
            <DialogActions style={{minWidth: '30vw'}}>
              <div>
                {
                  this.state.dialogData.is_cancel != true ? (<Button onClick={()=>this.handlePrintButton(this.state.dialogData.id)} color="primary" variant="contained" className={classes.button}>
                  Print
                  <PrintIcon className={classes.rightIcon}/></Button>) : (null)
                }
                {
                  this.state.dialogData.is_approved==null? 
                  (<div><Button onClick={()=>this.handleReject(this.state.dialogData.id)} color="secondary" variant="contained" className={classes.button}>Reject<BlockIcon className={classes.rightIcon}/></Button>
                  <Button onClick={()=>this.handleApproval(this.state.dialogData.id)} color="secondary" variant="contained" className={classes.button}>Approve<DoneIcon className={classes.rightIcon}/></Button></div>)
                  : (null)
                }
                {
                  this.state.dialogData.is_approved!=false && this.state.dialogData.is_cancel!=true ? 
                  (<Button onClick={this.handleClickOpenDelete} color="secondary" variant="contained" className={classes.button}>
                  Cancel Order
                  <ClearIcon className={classes.rightIcon} /></Button>) : (null)
                }
              </div>
            </DialogActions>
          </Dialog>
          <Dialog
            open={this.state.openDelete}
            onClose={this.handleCloseDelete}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">Are you sure you want to cancel record {this.state.dialogData.client_name} ?</DialogTitle>
            <DialogContent></DialogContent>
            <DialogActions>
              <Button onClick={this.handleCloseDelete} color="primary" className={classes.button}>
                Disagree
              </Button>
              <Button onClick={()=>this._handleCancelButton(this.state.dialogData.id,this.state.dialogData.start)} color="primary" className={classes.button}>
                Agree
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog
            open={this.state.openApproval}
            onClose={this.handleCloseApproval}
            scroll={this.state.scroll}
            aria-labelledby="scroll-dialog-title"
          >
            <DialogTitle id="scroll-dialog-title">Approve Data {this.state.dialogData.code}</DialogTitle>
            <DialogContent style={{minWidth: '30vw'}}>
              <DialogContentText>
                <form>
                {
                  this.state.crewList.map((item,id)=>(
                    <Grid container style={{flex:1}}>
                    <TextField
                      disabled={this.state.loading}
                      inputRef = {(input) => this['crewName'+id] = input}
                      label="Crew Name"
                      style={{flex:1}}
                      margin="normal"
                      variant="outlined"
                      fullWidth
                    />
                    <TextField
                      disabled={this.state.loading}
                      inputRef = {(input) => this['crewPosition'+id] = input}
                      label="Crew Position"
                      style={{flex:1}}
                      margin="normal"
                      variant="outlined"
                      fullWidth
                    />
                    </Grid>
                  ))
              }
                <Button onClick={()=>this.spanNewCrew()}>
                  Add new Crew
                </Button>
              </form>
            </DialogContentText>
            </DialogContent>
            <DialogActions>
              <div>
                <Button variant="contained" color="primary" onClick={()=>this._handleSubmitApprovalButton()} className={classes.button}>
                  Save
                  <SaveIcon style={styles.rightIcon} />
                </Button>
                <Button onClick={this.handleCloseApproval} color="secondary" variant="contained" className={classes.button}>
                  Cancel
                  <ClearIcon style={styles.rightIcon} />
                </Button>
              </div>
            </DialogActions>
          </Dialog>
          <div>
            <Button variant="fab" color="primary" aria-label="Add" className={classes.addButtonBottom} onClick={()=>{this.handleOpenAdd('reservation')}}>
              <AddIcon />
            </Button>
          </div>
        </Paper>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          open={this.state.loading}
          autoHideDuration={6000}
          onClose={this.handleClose}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">Loading...</span>}
        />
      </Grid>
    );
  }
}

Order.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Order);