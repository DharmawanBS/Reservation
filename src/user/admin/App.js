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
import {Route} from 'react-router-dom';
import Tooltip from '@material-ui/core/Tooltip';
import Popper from '@material-ui/core/Popper';

//icons
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Dashboard from '@material-ui/icons/Dashboard';
import AccountCircle from '@material-ui/icons/AccountCircle';
import NotificationsIcon from '@material-ui/icons/Notifications';
import InsertInvitation from '@material-ui/icons/InsertInvitation';
import Create from '@material-ui/icons/Create';
import Face from '@material-ui/icons/Face';
import DirectionsBus from '@material-ui/icons/DirectionsBus';

//routes
import Dashboards from './Dashboard';
import Reservation from './Reservation';
import ScheduleCalendar from './ScheduleCalendar';

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


class App extends Component {
  state = {
    open: false,
    title: 'Dashboard',
    popper : false
  };

  //update Title every page
  componentWillUpdate(nextProps, nextState) {
    var path = nextProps.location.pathname;
    if ( path === '/admin/') {
      nextState.title = 'Dashboard';
    }
    else {
      var title = path.replace('/admin/','');
      nextState.title = title.charAt(0).toUpperCase() + title.slice(1);
    }
    
  }

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  _toReservation = (text) => {
    this.props.history.replace('/admin/' + text);
  };

  _toHome = () => {
    this.props.history.push('/admin');
  };

  render() {
    const { classes, theme } = this.props;
    const { anchorEl } = this.state;
    const isMenuOpen = Boolean(anchorEl);

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
              >
                <AccountCircle />
              </IconButton>
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
              <Tooltip title='Manage Users' placement='right' disableHoverListener={this.state.open}>
                <ListItem button key={'users'} onClick={()=>{this._toReservation('users')}}>
                  <ListItemIcon><Face /></ListItemIcon>
                  <ListItemText primary={'Manage Users'} />
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
          </Grid>
        </main>
      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(App);