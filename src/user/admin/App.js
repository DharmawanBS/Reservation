import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import Badge from '@material-ui/core/Badge';
import Grid from '@material-ui/core/Grid';
import {Route, Redirect} from 'react-router-dom';
import Tooltip from '@material-ui/core/Tooltip';
import Popper from '@material-ui/core/Popper';
import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Cookies from 'universal-cookie';

//icons
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Dashboard from '@material-ui/icons/Dashboard';
import AccountCircle from '@material-ui/icons/AccountCircle';
import NotificationsIcon from '@material-ui/icons/Notifications';
import InsertInvitation from '@material-ui/icons/InsertInvitation';
import Create from '@material-ui/icons/Create';
import Face from '@material-ui/icons/Face';
import DirectionsBus from '@material-ui/icons/DirectionsBus';
import Receipt from '@material-ui/icons/Receipt'
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import People from '@material-ui/icons/People';
//routes
import Dashboards from './Dashboard';
import Reservation from './Reservation';
import ScheduleCalendar from './ScheduleCalendar';
import User from './User';
import Order from './Order';
import Vehicle from './Vehicles';
import EditUserForm from './EditUserForm';
import UserType from './UserType';
import NewUser from './NewUser';
import UpdateUser from './UpdateUser';
import VehicleEdit from './VehicleEdit';

const drawerWidth = 220;
const drawerHeight = '100vh';

const styles = theme => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  hide: {
    display: 'none',
  },
  drawerPaper: {
    position: 'fixed',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    height: drawerHeight,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing.unit * 7,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing.unit * 9,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
    alignItems:'center'
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  sectionDesktop: {
    marginLeft: 'auto'
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
});

const cookies = new Cookies();

class App extends Component {
  state = {
    open: false,
    title: 'Dashboard',
    popper : false,
    openProfile : false,
    user_id : null
  };

  //update Title every page
  componentWillUpdate(nextProps, nextState) {
    var path = nextProps.location.pathname;
    if ( path === '/admin/' || path === '/admin') {
      nextState.title = 'Dashboard';
    }
    else if (path.includes('/admin/order/')) {
      nextState.title = 'Update Order';
    }
    else if (path.includes('/admin/user/')) {
      nextState.title = 'User';
    }
    else {
      var title = path.replace('/admin/','');
      nextState.title = title.charAt(0).toUpperCase() + title.slice(1);
    }
    
  }

  componentDidMount(){
    console.log("Checking auth");
    var user_id= cookies.get('user_id');
    this.setState({
      user_id : user_id
    })
  }

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  _toReservation = (text) => {
    this.props.history.replace({
      pathname : '/admin/' + text,
    });
  };

  _toHome = () => {
    this.props.history.push({
      pathname : '/admin',
    });
  };

  _profileClick=(event)=>{
    const { currentTarget } = event;
    this.setState(state => ({
      anchorEl: currentTarget,
      openProfile: !state.openProfile,
    }));
  }

  _doLogOut=()=>{
    cookies.remove('user_id',{path:'/'});
    this.props.history.replace({
      pathname : '/'
    })
  }

  render() {
    const { classes, theme } = this.props;
    const { anchorEl } = this.state;
    const isMenuOpen = Boolean(anchorEl);

    if(cookies.get('user_id') == null){
      return(
        <Redirect to={{
          pathname : '/',
          state : {
            error : true
          }
        }}/>
      );
    }else{
      return (
        <div className={classes.root}>
          <CssBaseline />
          <AppBar
            position="fixed"
            className={classNames(classes.appBar, {
              [classes.appBarShift]: this.state.open,
            })}
          >
            <Toolbar disableGutters={!this.state.open}>
              <IconButton
                color="inherit"
                aria-label="Open drawer"
                onClick={this.handleDrawerOpen}
                className={classNames(classes.menuButton, {
                  [classes.hide]: this.state.open,
                })}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" color="inherit" noWrap>
                {this.state.title}
              </Typography>
              <div className={classes.grow} />
              <div className={classes.sectionDesktop}>
                <IconButton color="inherit">
                  <Badge badgeContent={17} color="secondary">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
                <IconButton
                  aria-owns={isMenuOpen ? 'material-appbar' : null}
                  aria-haspopup="true"
                  color="inherit"
                  onClick={(event)=>this._profileClick(event)}
                >
                  <AccountCircle />
                </IconButton>
                <Popper
                  style={{zIndex:99999}}
                 id={'popper'}
                 open={this.state.openProfile}
                 anchorEl={this.state.anchorEl}
                 transition>
                  {({ TransitionProps }) => (
                    <Fade {...TransitionProps}>
                      <Paper>
                      <MenuList>
                        <MenuItem className={classes.menuItem}>
                          <ListItemIcon className={classes.icon}>
                            <AccountCircle />
                          </ListItemIcon>
                          <ListItemText classes={{ primary: classes.primary }} inset primary="My Profile" />
                        </MenuItem>
                        <MenuItem className={classes.menuItem} onClick={()=>{this._doLogOut()}}>
                          <ListItemIcon className={classes.icon}>
                            <PowerSettingsNewIcon />
                          </ListItemIcon>
                          <ListItemText classes={{ primary: classes.primary }} inset primary="Log Out" />
                        </MenuItem>
                      </MenuList>
                      </Paper>
                    </Fade>
                  )}
                </Popper>
              </div>
            </Toolbar>
          </AppBar>
          <Drawer
            variant="permanent"
            classes={{
              paper: classNames(classes.drawerPaper, !this.state.open && classes.drawerPaperClose),
            }}
            open={this.state.open}
          >
            <div className={classes.toolbar}>
              <IconButton onClick={this.handleDrawerClose}>
                {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
              </IconButton>
            </div>
            <Divider />
            <List>
                <Tooltip title='Dashboard' placement='right' disableHoverListener={this.state.open}>
                  <ListItem button key={'admin'} onClick={()=>{this._toReservation('')}}>
                    <ListItemIcon><Dashboard /></ListItemIcon>
                    <ListItemText primary={'Dashboard'} />
                  </ListItem>
                </Tooltip>
                <Tooltip title='New Reservation' placement='right' disableHoverListener={this.state.open}>
                  <ListItem button key={'reservation'} onClick={()=>{this._toReservation('reservation')}}>
                    <ListItemIcon><Create /></ListItemIcon>
                    <ListItemText primary={'New Reservation'} />
                  </ListItem>
                </Tooltip>
                <Tooltip title='Schedules' placement='right' disableHoverListener={this.state.open}>
                  <ListItem button key={'schedule'} onClick={()=>{this._toReservation('schedules')}}>
                    <ListItemIcon><InsertInvitation /></ListItemIcon>
                    <ListItemText primary={'Schedules'} />
                  </ListItem>
                </Tooltip>
                <Tooltip title='Order Detail' placement='right' disableHoverListener={this.state.open}>
                  <ListItem button key={'orders'} onClick={()=>{this._toReservation('orders')}}>
                    <ListItemIcon><Receipt /></ListItemIcon>
                    <ListItemText primary={'Order Detail'} />
                  </ListItem>
                </Tooltip>
                <Tooltip title='Manage Users' placement='right' disableHoverListener={this.state.open}>
                  <ListItem button key={'users'} onClick={()=>{this._toReservation('users')}}>
                    <ListItemIcon><Face /></ListItemIcon>
                    <ListItemText primary={'Manage Users'} />
                  </ListItem>
                </Tooltip>
                <Tooltip title='Manage User Types' placement='right' disableHoverListener={this.state.open}>
                  <ListItem button key={'user-type'} onClick={()=>{this._toReservation('user-type')}}>
                    <ListItemIcon><People /></ListItemIcon>
                    <ListItemText primary={'Manage User Types'} />
                  </ListItem>
                </Tooltip>
                <Tooltip title='Manage Vehicles' placement='right' disableHoverListener={this.state.open}>
                  <ListItem button key={'vehicles'} onClick={()=>{this._toReservation('vehicles')}}>
                    <ListItemIcon><DirectionsBus /></ListItemIcon>
                    <ListItemText primary={'Manage Vehicles'} />
                  </ListItem>
                </Tooltip>
            </List>
          </Drawer>
          <main className={classes.content} style={{marginLeft: this.state.open? 225:55}}>
            <div className={classes.toolbar} />
            <Grid container alignItems='center' justify='center'>
              <Route exact path='/admin' component={Dashboards}/>
              <Route exact path='/admin/reservation' component={Reservation}/>
              <Route exact path='/admin/Schedules' component={ScheduleCalendar}/>
              <Route exact path='/admin/Users' component={User}/>
              <Route exact path='/admin/vehicles' component={Vehicle}/>
              <Route exact path='/admin/Orders' component={Order}/>
              <Route exact path='/admin/editformuser' component={EditUserForm}/>
              <Route exact path='/admin/user-type' component={UserType}/>
              <Route exact path='/admin/user/new' component={NewUser}/>
              <Route exact path='/admin/user/update/:id' component={UpdateUser}/>
              <Route exact path='/admin/vehicles/edit/:id' component={VehicleEdit}/>
            </Grid>
          </main>
        </div>
      );
    }
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(App);