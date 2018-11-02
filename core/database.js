const mysql = require( 'mysql' );

function Database() {
    this.connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'limamei1995',
        database: 'project'
    });
}

Database.prototype.run = function(sql, args) {
    return new Promise(((resolve, reject) => {
        this.connection.query(sql,args,(err,results) => {
            if (err) return reject(err);
            else {
                return resolve(results);
            }
        })
    }))
};

Database.prototype.close = function() {
    return new Promise((resolve, reject) => {
        this.connection.end(err => {
            if (err) return reject(err);
            resolve();
        } );
    } );
};

module.exports = Database;