const express = require('express');
const bodyParser = require('body-parser');
const Database = require('./database');

const app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

function Main() {
    this.router = express.Router();
    this.db = new Database();

    this.msg_ok = 'ok';
    this.msg_empty = 'empty';

    this.msg_created = 'created';
    this.msg_updated = 'updated';

    this.msg_not_found = 'not_found';
    this.msg_failed = 'failed';
    this.msg_invalid = 'invalid';
    this.msg_unauthorized = 'unauthorized';
    this.msg_something_error = 'something error';
}

Main.prototype.getRouter = function() {
    return this.router;
};

Main.prototype.getDB = function() {
    return this.db;
};

Main.prototype.isEmpty = function(item) {
    return (item === '' || item == null);
};

Main.prototype.output = function (res,code,msg,data) {
    if (msg == null) msg = this.msg_ok;
    if (code == null) code = 200;
    res.statusCode = code;
    res.json({ msg: msg,data:data });
};

module.exports = Main;