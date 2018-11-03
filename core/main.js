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

Main.prototype.isEmpty = function(item) {
    return (item === '' || item == null);
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
    res.json({ msg: msg,data:data });
};

module.exports = Main;