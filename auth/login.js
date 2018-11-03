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

        let query = "select user_id,user_type_id from user where user_name = '" + username + "' and user_password = '" + password + "'";
        db.run(query).then(
            rows => {
                if (rows.length > 0) {
                    const payload = {
                        id: rows[0].user_id,
                        type: rows[0].user_type_id
                    };

                    let token = main.getJWT().sign(payload, main.getConfig().secret, {
                        expiresIn: main.getConfig().duration // expires in 15 minute
                    });

                    main.output(res,200,main.msg_ok,token);
                }
                else res.redirect('/failed');
            }
        ).catch( err => {
            //console.log(err);
            res.redirect('/something_error');
        });
    }
});

module.exports = router;