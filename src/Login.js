import React, { Component } from "react";
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import IconButton from '@material-ui/core/IconButton';
import Cookies from 'universal-cookie';

//icons
import CloseIcon from '@material-ui/icons/Close';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import green from '@material-ui/core/colors/green';
import amber from '@material-ui/core/colors/amber';
import WarningIcon from '@material-ui/icons/Warning';


const cookies = new Cookies();

class Login extends Component {
  state = {
      uname : '',
      pword : '',
      empty_uname : false,
      empty_pass : false,
      snack : false,
      err : false,
      fail : false
  };

  componentDidMount(){
      if(this.props.location.state !== null){
          this.setState({
              err : this.props.location.state
          })
      }
      if(cookies.get('user_id', {path:'/'}) != null){
          this.props.history.replace({
              pathname : '/admin'
          })
      }
  }

  _onSubmit=()=>{
      this.setState({loading : true})
      switch(true){
          case this.state.empty_pass :
          case this.state.pword === "" :
          this.setState({
              empty_pass : true,
              fail : true
          });
          case this.state.empty_uname :
          case this.state.uname === "" :
          this.setState({
              empty_uname : true,
              fail : true
          });
          break;
          default : 
          this._submitForm();
          break;
      }
    }

    _submitForm =()=>{
        var data = {
            "username": this.state.uname,
            "password": this.state.pword
        };
        console.log(data);
        fetch("http://api.jakartabusrent.com/index.php/Auth/login",{
            method : 'POST',
            headers: {
                'content-type': 'application/json',
                'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
            },
            body : JSON.stringify(data)
        }).then((response) => response.json())
        .then((responseJSON) => {
            console.log(JSON.stringify(responseJSON));
            if(responseJSON.msg.toLowerCase() === 'ok' && responseJSON.data != null){
                this.setState({snack : true});
                cookies.set('user_id',responseJSON.data.id,{path:'/'});
                cookies.set('user_metadata',JSON.stringify(responseJSON.data.meta));
                setTimeout(
                    ()=>{
                        this.props.history.replace({
                            pathname : '/admin',
                            state : {user_id : responseJSON.data.id}
                        });
                    },
                    1000
                )
            }else if(responseJSON.msg.toLowerCase() === 'failed'){
                this.setState({
                    loading : false,
                    fail : true
                })
            }
        })
        .catch(error => console.log(error));
    }

    handleClose=(str)=>{
        switch(str){
            case 'snack' :
            this.setState({
                snack : false
            });break;
            case 'err' :
            this.setState({
                err : false
            });break;
            case 'fail' :
            this.setState({
                fail : false
            });break;
            default : break;
        }
        
    }

  render() {
    return (
    <Grid container justify='center' alignItems='center' style={{flex:1, height:'100vh', padding:16}}>
        <Paper style={{padding:16, textAlign:'center', width:425}}>
            <form onSubmit={(event)=>{
                event.preventDefault();
                this._onSubmit();
                }}>
                <Typography variant='h6'>
                    LOGIN
                </Typography>
                <TextField
                    id="username"
                    label="Username"
                    fullWidth
                    disabled={this.state.loading}
                    error={this.state.empty_uname}
                    margin="dense"
                    variant="outlined"
                    value = {this.state.uname}
                    onChange = {(e)=>{
                        this.setState({uname : e.target.value, empty_uname : (e.target.value === "")})
                    }}
                />
                {
                    this.state.empty_uname?
                    <div style={{textAlign:'left', paddingLeft:8}}>
                        <Typography variant='subtitle1' colo='red' style={{color:'red'}}>
                            Username cannot be empty!
                        </Typography>
                    </div>
                    :
                    null
                }
                <TextField
                    id="password"
                    label="Password"
                    fullWidth
                    disabled={this.state.loading}
                    error={this.state.empty_pass}
                    type='password'
                    margin="dense"
                    variant="outlined"
                    value = {this.state.pword}
                    onChange = {(e)=>{
                        this.setState({pword : e.target.value, empty_pass : (e.target.value === "")})
                    }}
                />
                {
                    this.state.empty_pass?
                    <div style={{textAlign:'left', paddingLeft:8}}>
                        <Typography variant='subtitle1' colo='red' style={{color:'red'}}>
                        Password cannot be empty!
                        </Typography>
                    </div>
                    :
                    null
                }
                <Grid style={{textAlign:'right'}}>
                    <Button type='submit' variant="contained" disabled={this.state.loading} color="primary" style={{marginTop:24}}
                        onSubmit={(event)=>{
                            event.preventDefault();
                            this._onSubmit();
                            }}>
                        Login
                    </Button>
                </Grid>
            </form>
        </Paper>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          open={this.state.err}
          autoHideDuration={6000}
          onClose={()=>this.handleClose('err')}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
        >
            <SnackbarContent
            aria-describedby="client-snackbar"
            style={{backgroundColor:'red'}}
            message={
                <span id="client-snackbar" style={{display: 'flex',alignItems: 'center',}}>
                <ErrorIcon style={{fontSize:20, opacity:0.9, marginRight:8}}/>
                You need to log in to view the page
                </span>
            }
            action={[
                <IconButton
                onClick={()=>this.handleClose('err')}
                key="close"
                aria-label="Close"
                color="inherit"
                >
                <CloseIcon/>
                </IconButton>,
            ]}
            />
        </Snackbar>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          open={this.state.snack}
          autoHideDuration={6000}
          onClose={()=>this.handleClose('snack')}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
        >
            <SnackbarContent
            aria-describedby="client-snackbar"
            style={{backgroundColor:green[600]}}
            message={
                <span id="client-snackbar" style={{display: 'flex',alignItems: 'center',}}>
                <CheckCircleIcon style={{fontSize:20, opacity:0.9, marginRight:8}}/>
                Login Success, Redirecting...
                </span>
            }
            />
        </Snackbar>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          open={this.state.fail}
          autoHideDuration={6000}
          onClose={()=>this.handleClose('fail')}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
        >
            <SnackbarContent
            aria-describedby="client-snackbar"
            style={{backgroundColor:'red'}}
            message={
                <span id="client-snackbar" style={{display: 'flex',alignItems: 'center',}}>
                <ErrorIcon style={{fontSize:20, opacity:0.9, marginRight:8}}/>
                Failed to login, please check again
                </span>
            }
            action={[
                <IconButton
                onClick={()=>this.handleClose('fail')}
                key="close"
                aria-label="Close"
                color="inherit"
                >
                <CloseIcon/>
                </IconButton>,
            ]}
            />
        </Snackbar>
    </Grid>
    );
  }
}

export default Login;