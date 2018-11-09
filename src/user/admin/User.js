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

//styles
import { withStyles } from '@material-ui/core/styles';

//icons
import DeleteIcon from '@material-ui/icons/Delete';
import CreateIcon from '@material-ui/icons/Create';
import SaveIcon from '@material-ui/icons/Save'

let num = 0;
function createData(idnum, name, address, total, last_resv) {
    num += 1;
    return { num, idnum, name, address, total, last_resv };
}

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
    { id: 'num', numeric: false, disablePadding: false, label: '#' },
    { id: 'idnum', numeric: false, disablePadding: false, label: 'ID Number' },
    { id: 'name', numeric: false, disablePadding: false, label: 'Name' },
    { id: 'address', numeric: false, disablePadding: false, label: 'Address' },
    { id: 'total', numeric: false, disablePadding: false, label: 'Total' },
    { id: 'last_resv', numeric: false, disablePadding: false, label: 'Last Reservation' },
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
            List Users
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
});

class User extends Component {
  state = {
    order: 'asc',
    orderBy: 'num',
    data: [
        createData('123456789', 'Adi Lalala', 'Jl. Mawar 1 Jakarta Pusat', 3, '05/06/2018'),
        createData('112233445', 'Boni Yeyeye', 'Jl. Melati 2 Jakarta Barat', 1, '25/05/2018'),
        createData('789456723', 'Citra Lololo', 'Jl. Kamboja 3 Jakarta Selatan', 2, '14/10/2018'),
        createData('145683582', 'Deni Hahahaha', 'Jl. Sepatu 4 Jakarta Utara', 1, '09/03/2018'),
        createData('673825146', 'Eka Yoyoyo', 'Jl. Tulip 5 Jakarta Timur', 4, '01/09/2018'),
        createData('673941674', 'Feni Yayaya', 'Jl. Cemara 6 Bekasi', 1, '01/10/2018'),
    ],
    page: 0,
    rowsPerPage: 5,
    open: false,
    scroll: 'paper',
    dialogData: [],
    openDelete: false,
    edit: false,
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

  handleClickOpen = (scroll,rowData) => () => {
    this.setState({ open: true, scroll, dialogData: rowData });
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
 
  render() {
    const { classes } = this.props;
    const { data, order, orderBy, selected, rowsPerPage, page } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

    return (
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
                      onClick={this.handleClickOpen('paper',n)}
                    >
                      <TableCell component="th" scope="row" padding="default">
                        {n.num}
                      </TableCell>
                      <TableCell>{n.idnum}</TableCell>
                      <TableCell>{n.name}</TableCell>
                      <TableCell>{n.address}</TableCell>
                      <TableCell>{n.total}</TableCell>
                      <TableCell>{n.last_resv}</TableCell>
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
          <DialogTitle id="scroll-dialog-title">User Data</DialogTitle>
          <DialogContent style={{minWidth: '30vw'}}>
            <DialogContentText>
              {
                ! this.state.edit ? (
                  <List>
                    <ListItem>
                      <ListItemText primary="ID Number" secondary={this.state.dialogData.idnum} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Name" secondary={this.state.dialogData.name} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Address" secondary={this.state.dialogData.address} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Total" secondary={this.state.dialogData.total} />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="Last Reservation" secondary={this.state.dialogData.last_resv} />
                    </ListItem>
                  </List>
                ) : (
                  <form>
                    <TextField
                    id="client-idnum"
                    label="Client ID Number"
                    value={this.state.dialogData.idnum}
                    fullWidth
                    className={[classes.textField, classes.dense]}
                    margin="dense"
                    variant="outlined"
                    />
                    <TextField
                      id="client-name"
                      label="Client Full Name"
                      value={this.state.dialogData.name}
                      fullWidth
                      className={[classes.textField, classes.dense]}
                      margin="dense"
                      variant="outlined"
                    />
                    <TextField
                      id="client-address"
                      label="Client Address"
                      value={this.state.dialogData.address}
                      fullWidth
                      className={[classes.textField, classes.dense]}
                      margin="dense"
                      variant="outlined"
                    />
                    <TextField
                      id="client-email"
                      label="Client Email"
                      fullWidth
                      className={[classes.textField, classes.dense]}
                      margin="dense"
                      variant="outlined"
                    />
                    <TextField
                      id="client-phoneNum"
                      label="Client Phone Number"
                      fullWidth
                      className={[classes.textField, classes.dense]}
                      margin="dense"
                      variant="outlined"
                    />
                    <div style={{textAlign: 'right'}}>
                      <Button variant="contained" color="primary" style={styles.button} onClick={this.handleClose}>
                        <SaveIcon style={styles.leftIcon} />
                        Save
                      </Button>
                    </div>
                  </form>
                )
              }
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            {
              ! this.state.edit ? (
                <div>
                  <Button onClick={this.handleEdit} color="primary" variant="contained">
                    Edit
                    <CreateIcon className={classes.rightIcon}/>
                  </Button>
                  <Button onClick={this.handleClickOpenDelete} color="secondary" variant="contained">
                    Delete
                    <DeleteIcon className={classes.rightIcon} />
                  </Button>
                </div>
              ) : (
                <Button onClick={this.handleClickCancel} color="secondary" variant="contained">
                  Cancel
                </Button>
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
          <DialogTitle id="alert-dialog-title">Are you sure you want to delete user {this.state.dialogData.name} ?</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Deleting this user means you can not access this user's data anymore.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleCloseDelete} color="primary">
              Disagree
            </Button>
            <Button onClick={this.handleCloseDelete} color="primary">
              Agree
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    );
  }
}

User.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(User);