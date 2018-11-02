const Main = require('../core/main');
const main = new Main();
const router = main.getRouter();

router.post('/', function(req, res, next) {
    let username = req.body.username;
    let password = req.body.password;

    if (main.isEmpty(username) || main.isEmpty(password)) {
        res.redirect('/invalid');
    }
    else {
        const db = main.getDB();

        let query = "select count(*) as jum from user where user_name = '" + username + "' and user_password = '" + password + "'";
        db.run(query).then(
            rows => {
                if (rows[0].jum > 0) main.output(res,null,null,null);
                else res.redirect('/failed');
            }
        ).catch( err => {
            //console.log(err);
            res.redirect('/something_error');
        });
    }
});

module.exports = router;