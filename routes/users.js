var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();

var app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

/* GET users listing. */
router.post('/', function(req, res, next) {
  res.send(req.body);
});

module.exports = router;
