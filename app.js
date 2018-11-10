const express = require('express');
const logger = require('morgan');
const config = require('./core/config');
const jwt = require('jsonwebtoken');

const app = express();

app.use(logger('dev'));

const router = express.Router();
app.use('/api', router);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//  API Auth
app.use('/login', require('./auth/login'));
app.use('/profil', require('./auth/profil'));

//  API Control
app.use('/user_view', require('./control/user_view'));
app.use('/user_insert', require('./control/user_insert'));
app.use('/vehicle_view', require('./control/vehicle_view'));

//  API Usertype
app.use('/usertype_insert', require('./ueer_type/usertype_insert'));
app.use('/usertype_view', require('./ueer_type/usertype_view'));
app.use('/usertype_delete', require('./ueer_type/usertype_delete'));
app.use('/usertype_update', require('./ueer_type/usertype_update'));

//  default output
app.use('/empty', require('./output/empty'));
app.use('/created', require('./output/created'));
app.use('/updated', require('./output/updated'));
app.use('/something_error', require('./output/something_error'));
app.use('/invalid', require('./output/invalid'));
app.use('/failed', require('./output/failed'));
app.use('/not_found', require('./output/not_found'));
app.use('/unauthorized', require('./output/unauthorized'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    res.redirect('/not_found');
});

module.exports = app;