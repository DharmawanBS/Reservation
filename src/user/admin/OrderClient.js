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
import Chip from '@material-ui/core/Chip';

//styles
import { withStyles } from '@material-ui/core/styles';

//icons
import BlockIcon from '@material-ui/icons/Block';
import DoneIcon from '@material-ui/icons/Done';

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
    { id: 'client_name', numeric: false, disablePadding: false, label: 'Client Name' },
    { id: 'created', numeric: false, disablePadding: false, label: 'Order Created Date' },
    { id: 'start', numeric: false, disablePadding: false, label: 'Start Date' },
    { id: 'end', numeric: false, disablePadding: false, label: 'End Date' },
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
            List Orders from User
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

class OrderClient extends Component {
  state = {
    order: 'desc',
    orderBy: 'created',
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
      payment: []
    },
  };

  handleChange = name => event => {
    this.setState({
        [name]: event.target.value,
    });
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
        dialogData: responseJSON.data[0],
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

  handleEdit = (text) => {
    this.props.history.replace('/admin/orders/user/approve/' + text);
  }

  fetchData=()=>{
    var arr = []
    this.setState({loading: true});
    //get list all reservasi
    fetch('http://www.api.jakartabusrent.com/index.php/reservation/read',{
      method : 'POST',
      headers: {
        'content-type': 'application/json',
        'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
      },
		}).then(response => response.json())
		.then(responseJSON => {
		  //console.log(JSON.stringify(responseJSON.data))
		  if(responseJSON.msg.toLowerCase() === 'ok'){
            arr = responseJSON.data;
            this.filterData(arr);
            this.setState({
            loading: false
            });
        }
        else if (responseJSON.msg.toLowerCase() === 'empty') {
            this.setState({
                loading: false
            });
        }
    });
  }

  filterData = (data) => {
    var arr=[];
    let j=0;
    if (data.length > 0){
      for (var i=0;i<data.length;i++){
        if(data[i].is_approved == null) {
          arr[j]=data[i];
          j+=1;
        }
      }
      this.setState({
          data: arr
      });
    }
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
    fetch('http://www.api.jakartabusrent.com/index.php/reservation/update',{
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
      is_approved : false,
      client_name : this.state.dialogData.client_name,
      client_phone : this.state.dialogData.client_phone,
      destination : this.state.dialogData.destination,
      pick_up_location : this.state.dialogData.pick_up_location,
      start : this.state.dialogData.start,
      end : this.state.dialogData.end,
      vehicle : this.state.dialogData.vehicle_id,
      notes : this.state.dialogData.notes,
    }
    console.log(JSON.stringify(obj));
    return JSON.stringify(obj);
  }

  handleUpdatePayment = () => {
    this.setState({
      loading : true
    })
    fetch('http://www.api.jakartabusrent.com/index.php/reservation/update',{
        method : 'POST',
        headers: {
            'content-type': 'application/json',
            'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
        },
        body : this._buildUpdatePayment(this.state.dialogData.id)
    }).then(response => response.json())
    .then(responseJSON =>{
        if(responseJSON.msg.toLowerCase() === 'ok'){
          this.setState({
            submit_success : true,
            loading : false,
          });
          this.handleClosePayment();
          this.fetchData();
        }
    })
    .catch(e=>console.log(e));
  }

  dateFormatter=(date)=>{
		return date.replace('T', ' ');
	}

  _buildUpdatePayment = (id) => {
    var obj ={
      id : id,
      is_approved : true,
      user : cookie.get('user_id'),
      client_name : this.state.dialogData.client_name,
      client_phone : this.state.dialogData.client_phone,
      destination : this.state.dialogData.destination,
      pick_up_location : this.state.dialogData.pick_up_location,
      start : this.state.dialogData.start,
      end : this.state.dialogData.end,
      vehicle : this.state.dialogData.vehicle_id,
      notes : this.state.dialogData.notes,
      payment_method: this.state.methodValue,
      payment_type: this.state.typeValue,
      payment_price: this['payment_price'].value,
      payment_date: this.dateFormatter(this.state.payment_date),
    }
    console.log(JSON.stringify(obj));
    return JSON.stringify(obj);
  }

  statusInTable = (approve) => {
    if (approve==true) {
      return (<Chip size="small" variant="contained" style={{backgroundColor:'#00e676'}} label="Approved"></Chip>)
    } else if (approve==false) {
      return (<Chip size="small" variant="contained" style={{backgroundColor: '#b71c1c',color: 'white'}} label='Canceled'></Chip>);
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
                        <TableCell>{n.client_name}</TableCell>
                        <TableCell>{moment(n.created).format('LL')}</TableCell>
                        <TableCell>{moment(n.start).format('lll')}</TableCell>
                        <TableCell>{moment(n.end).format('lll')}</TableCell>
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
            <DialogTitle id="scroll-dialog-title">Reservation Data from {this.state.dialogData.client_name}</DialogTitle>
            <DialogContent style={{minWidth: '30vw'}}>
              <DialogContentText>
                <List>
                  <ListItem>
                    <ListItemText primary="Order Created Date" secondary={moment(this.state.dialogData.created).format('LL')} />
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
                    <ListItemText primary="Start Date" secondary={moment(this.state.dialogData.start).format('LLL')} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="End Date" secondary={moment(this.state.dialogData.end).format('LLL')} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="- Payment History -"/>
                  </ListItem>
                  {
                    this.state.dialogData.payment != null ? (
                    this.state.dialogData.payment.map(n => (
                      <ListItem>
                        <ListItemText style={{textTransform: 'uppercase'}} primary={n.payment_method+' '+n.payment_type + ' IDR '+n.payment_price} secondary={moment(n.payment_insert).format('LL')}/>
                      </ListItem>
                    ))) : (
                      <ListItem>
                        <ListItemText style={{textTransform: 'uppercase'}} primary="none"/>
                      </ListItem>)
                  }
                </List>
              </DialogContentText>
            </DialogContent>
            <DialogActions style={{minWidth: '30vw'}}>
              <div>
                <Button onClick={()=>this.handleEdit(this.state.dialogData.id)} color="primary" variant="contained" className={classes.button}>
                    Approve
                    <DoneIcon className={classes.rightIcon} />
                </Button>
                <Button onClick={this.handleClickOpenDelete} color="secondary" variant="contained" className={classes.button}>
                    Reject
                    <BlockIcon className={classes.rightIcon} />
                </Button>
              </div>
            </DialogActions>
          </Dialog>
          <Dialog
            open={this.state.openDelete}
            onClose={this.handleCloseDelete}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">Are you sure you want to reject order from {this.state.dialogData.client_name} ?</DialogTitle>
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

OrderClient.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(OrderClient);