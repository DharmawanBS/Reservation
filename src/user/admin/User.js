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
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Cookies from 'universal-cookie';

//styles
import { withStyles } from '@material-ui/core/styles';

//icons
import DeleteIcon from '@material-ui/icons/Delete';
import CreateIcon from '@material-ui/icons/Create';
import SaveIcon from '@material-ui/icons/Save';
import AddIcon from '@material-ui/icons/Add';
import BlockIcon from '@material-ui/icons/Block';
import ClearIcon from '@material-ui/icons/Clear';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

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
    { id: 'name', numeric: false, disablePadding: false, label: 'Name' },
    { id: 'key', numeric: false, disablePadding: false, label: 'Key' },
    { id: 'type', numeric: false, disablePadding: false, label: 'Type' },
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
  addButtonBottom: {
    position: 'fixed',
    bottom: '1vh',
    right: '2vw'
  },
  addButtonBottom2: {
    position: 'fixed',
    bottom: '1vh',
  },
  divRoot: {
    paddingBottom: '5vh',
  },
  button: {
    marginRight: theme.spacing.unit,
  }
});

const cookie = new Cookies();

class User extends Component {
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
    userTypes: '',
    password: '',
    showPassword: false,
    data: [],
    userTypeData: [],
    openAddType: false,
    loading: '',
    submitType_success: '',
  };

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    this.setState({ order, orderBy });
  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  handleChangeType = event => {
    this.setState({ userTypes: event.target.value});
  }
  
  handleClickShowPassword = () => {
    this.setState(state => ({ showPassword: !state.showPassword }));
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  handleClickOpen = (scroll,num) => () => {
    fetch('http://www.api.jakartabusrent.com/index.php/User/read',{
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
    })
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

  handleOpenAdd = () => {
    this.setState({ openAdd: true});
  }

  handleCloseAdd = () => {
    this.setState({ openAdd: false, password: ''});
  }

  handleOpenAddType = () => {
    this.setState({ openAddType: true});
  }

  handleCloseAddType = () => {
    this.setState({ openAddType: false});
  }

  _handleSubmitButton=()=>{
		if(!this._emptyChecker()){
			if(window.confirm("Submit this data?")){
				this._submitPayload();
			}
		}else{
			window.alert('Form cannot be empty, please check again');
		}
		
  }

  _emptyChecker=()=>{
		var empty = false;
		switch(true){
			case this['client_name'].value === '' :
			case this['client_phone'].value === '':
			case this['client_destination'].value === '':
			case this['client_pick_up'].value === '':
			case this['client_start_date'].value === '':
			case this['client_finish_date'].value === '':
			case this.state.busType === '':
			case this['client_notes'].value === '':
			return true;
			default : return false;
		}
  }

  fetchData=()=>{
    //get list all user
    fetch('http://www.api.jakartabusrent.com/index.php/User/read',{
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

    //get list user type
    fetch('http://www.api.jakartabusrent.com/index.php/User_type/read',{
		  method : 'POST'
		}).then(response => response.json())
		.then(responseJSON => {
		  console.log(JSON.stringify(responseJSON.data))
		  let arr = [];
		  if(responseJSON.msg.toLowerCase() === 'ok'){
			this.setState({
			  userTypeData : responseJSON.data
			});
		  }
		})
	}

	componentDidMount(){
		this.fetchData();
	}
 
  render() {
    const { classes } = this.props;
    const { data, order, orderBy, selected, rowsPerPage, page } = this.state;
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
                  .map((n,id) => {
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
                        <TableCell>{n.name}</TableCell>
                        <TableCell>{n.key}</TableCell>
                        <TableCell>{n.type}</TableCell>
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
                        <ListItemText primary="ID Number" secondary={this.state.dialogData.id} />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="Name" secondary={this.state.dialogData.name} />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="Key" secondary={this.state.dialogData.key} />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="Type" secondary={this.state.dialogData.type} />
                      </ListItem>
                    </List>
                  ) : (
                    <form>
                      <TextField
                      id="user-idnum"
                      inputRef = {(input) => this['id'] = input}
                      label="User ID Number"
                      defaultValue={this.state.dialogData.id}
                      fullWidth
                      className={[classes.textField, classes.dense]}
                      margin="dense"
                      variant="outlined"
                      />
                      <TextField
                        id="user-name"
                        inputRef = {(input) => this['name'] = input}
                        label="User Name"
                        defaultValue={this.state.dialogData.name}
                        fullWidth
                        className={[classes.textField, classes.dense]}
                        margin="dense"
                        variant="outlined"
                      />
                      <TextField
                        id="user-key"
                        inputRef = {(input) => this['key'] = input}
                        label="User Key"
                        defaultValue={this.state.dialogData.key}
                        fullWidth
                        className={[classes.textField, classes.dense]}
                        margin="dense"
                        variant="outlined"
                      />
                      <TextField
                        id="user-password"
                        inputRef = {(input) => this['password'] = input}
                        className={[(classes.dense, classes.textField)]}
                        variant="outlined"
                        type={this.state.showPassword ? 'text' : 'password'}
                        label="User Password"
                        fullWidth
                        defaultValue={this.state.dialogData.password}
                        value = {this.state.password}
                        onChange={this.handleChange('password')}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="Toggle password visibility"
                                onClick={this.handleClickShowPassword}
                              >
                                {this.state.showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                      <TextField
                        select
                        inputRef = {(input) => this['type'] = input}
                        label="User Type"
                        className={[classes.textField, classes.dense]}
                        value={this.state.userTypes}
                        defaultValue={this.state.dialogData.type}
                        onChange={this.handleChange('userTypes')}
                        margin="dense"
                        variant="outlined"
                        fullWidth
                        SelectProps={{
                          MenuProps: {
                          
                          },
                        }}
                      >
                        {this.state.userTypeData.map(option => (
                          <MenuItem key={option.id} value={option.id}>
                          {option.name}
                          </MenuItem>
                        ))}
                      </TextField>
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
            <DialogTitle id="alert-dialog-title">Are you sure you want to delete user {this.state.dialogData.name} ?</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Deleting this user means you can not access this user's data anymore.
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
          <Dialog
            open={this.state.openAdd}
            onClose={this.handleCloseAdd}
            scroll={this.state.scroll}
            aria-labelledby="scroll-dialog-title"
            disableBackdropClick
            disableEscapeKeyDown
          >
            <DialogTitle id="scroll-dialog-title">Create New User</DialogTitle>
            <DialogContent style={{minWidth: '30vw'}}>
              <DialogContentText>
                <form>
                  <TextField
                    id="user-name"
                    inputRef = {(input) => this['name'] = input}
                    label="User Name"
                    fullWidth
                    className={[classes.textField, classes.dense]}
                    margin="dense"
                    variant="outlined"
                  />
                  <TextField
                    id="user-key"
                    inputRef = {(input) => this['key'] = input}
                    label="User Key"
                    fullWidth
                    className={[classes.textField, classes.dense]}
                    margin="dense"
                    variant="outlined"
                  />
                  <TextField
                    id="user-password"
                    inputRef = {(input) => this['password'] = input}
                    className={[(classes.dense, classes.textField)]}
                    variant="outlined"
                    type={this.state.showPassword ? 'text' : 'password'}
                    label="User Password"
                    fullWidth
                    value={this.state.password}
                    onChange={this.handleChange('password')}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="Toggle password visibility"
                            onClick={this.handleClickShowPassword}
                          >
                            {this.state.showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    select
                    inputRef = {(input) => this['type'] = input}
                    label="User Type"
                    className={[classes.textField, classes.dense]}
                    value={this.state.userTypes}
                    onChange={(e)=>{this.setState({userTypes : e.target.value})}}
                    margin="dense"
                    variant="outlined"
                    fullWidth
                    SelectProps={{
                      MenuProps: {
                      
                      },
                    }}
                  >
                    {this.state.userTypeData.map(option => (
                      <MenuItem key={option.id} value={option.id}>
                      {option.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </form>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button variant="contained" color="primary" onClick={this.handleCloseAdd} className={classes.button}>
                Save
                <SaveIcon style={styles.rightIcon} />
              </Button>
              <Button onClick={this.handleCloseAdd} color="secondary" variant="contained" className={classes.button}>
                Cancel
                <ClearIcon style={styles.rightIcon} />
              </Button>
            </DialogActions>
          </Dialog>
          <div>
            <Button variant="fab" color="primary" aria-label="New User" className={classes.addButtonBottom} onClick={this.handleOpenAdd}>
              <AddIcon />
            </Button>
          </div>
        </Paper>
      </Grid>
    );
  }
}

User.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(User);