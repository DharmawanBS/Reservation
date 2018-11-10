const express = require('express');
const bodyParser = require('body-parser');
const Database = require('./database');
const config = require('./config');
const jwt = require('jsonwebtoken');

const app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

function Main() {
    this.router = express.Router();
    this.db = new Database();
    this.jwt = jwt;

    this.msg_ok = 'ok';
    this.msg_empty = 'empty';

    this.msg_created = 'created';
    this.msg_updated = 'updated';

    this.msg_not_found = 'not_found';
    this.msg_failed = 'failed';
    this.msg_invalid = 'invalid';
    this.msg_unauthorized = 'unauthorized';
    this.msg_something_error = 'something error';

    this.default_type = 'text';
    this.default_show = true;
    this.default_nullable = true;
}

Main.prototype.getRouter = function() {
    return this.router;
};

Main.prototype.getDB = function() {
    return this.db;
};

Main.prototype.getJWT = function() {
    return this.jwt;
};

Main.prototype.getCurrentDate = function() {
    let date = new Date();
    return date.getYear() + 1900
        + '-'
        + ((date.getMonth() + 1 < 10) ? '0' + (date.getMonth() + 1) : date.getMonth() + 1)
        + '-'
        + date.getDate()
        + ' '
        + date.getHours()
        + ':'
        + ((date.getMinutes() < 10) ? '0' + (date.getMinutes()) : date.getMinutes())
        + ':'
        + ((date.getSeconds() < 10) ? '0' + (date.getSeconds()) : date.getSeconds());
};

Main.prototype.inputCheck = function(res,item, is_bool = false, is_number = false, is_string = false, is_object = false, is_data_type = false) {
    if (item === '' || item == null) {
        return null;
    }
    if (is_bool) {
        if (typeof item === 'boolean') return item;
        else return null;
    }
    if (is_number) {
        if (typeof item === 'number') return item;
        else return null;
    }
    if (is_string) {
        if (typeof item === 'string') return item;
        else return null;
    }
    if (is_object) {
        if (typeof item === 'object') return item;
        else return null;
    }
    if (is_data_type) {
        switch(item) {
            case 'text':
                return item;
            case 'int':
                return item;
            default:
                return null;
        }
    }
    return item;
};

Main.prototype.getConfig = function() {
    return config;
};

Main.prototype.auth = function(req) {
    return new Promise(((resolve, reject) => {

        // check header or url parameters or post parameters for token
        let token = req.headers['token'];

        // decode token
        if (token) {

            // verifies secret and checks exp
            jwt.verify(token, config.secret, (err, decoded) => {
                if (err) return reject(err);
                else return resolve(decoded);
            });
        }
        else return null;
    }));
};

Main.prototype.output = function (res,code,msg,data) {
    if (msg == null) msg = this.msg_ok;
    if (code == null) code = 200;
    res.statusCode = code;
    return res.json({ msg: msg,data:data });
};

module.exports = Main;