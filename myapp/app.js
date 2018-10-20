const express = require('express')
const app = express()
const port = 3009

app.get('/', (req, res) => res.send('Hendra Darmawan'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

var mysql = require('mysql')
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'project'
});

connection.connect(function(err) {
    if (err) throw err;
    connection.query("SELECT * FROM item", function (err, result, fields) {
        if (err) throw err;
        console.log(result);
    });
});