let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');

//  API Auth
let login = require('./auth/login');

//  default output
let empty = require('./output/empty');
let created = require('./output/created');
let updated = require('./output/updated');
let something_error = require('./output/something_error');
let invalid = require('./output/invalid');
let failed = require('./output/failed');
let not_found = require('./output/not_found');
let unauthorized = require('./output/unauthorized');

let app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/login', login);

app.use('/empty', empty);
app.use('/created', created);
app.use('/updated', updated);
app.use('/something_error', something_error);
app.use('/invalid', invalid);
app.use('/failed', failed);
app.use('/not_found', not_found);
app.use('/unauthorized', unauthorized);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    res.redirect('/not_found');
});

module.exports = app;