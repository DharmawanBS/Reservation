import React, { Component } from "react";
import { Grid, Paper, Typography, TextField, Button } from "@material-ui/core";

class Login extends Component {
  state = {

  };

  render() {
    return (
    <Grid container justify='center' alignItems='center' style={{flex:1, height:'100vh', padding:16}}>
        <Paper style={{padding:16, textAlign:'center'}}>
            <Typography variant='title'>
                LOGIN
            </Typography>
            <TextField
                id="username"
                label="Username"
                fullWidth
                margin="dense"
                variant="outlined"
            />
            <TextField
                id="password"
                label="Password"
                fullWidth
                type='password'
                margin="dense"
                variant="outlined"
            />
            <Grid style={{textAlign:'right'}}>
                <Button variant="contained" color="primary" style={{marginTop:24}}>
                    Login
                </Button>
            </Grid>
        </Paper>
    </Grid>
    );
  }
}

export default Login;