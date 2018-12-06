const Main = require('../core/main');
const main = new Main();
const router = main.getRouter();

router.post('/', function(req, res, next) {
    let username = main.inputCheck(res,req.body.username,false,false,true,false);
    let password = main.inputCheck(res,req.body.password,false,false,true,false);

    if (username === null || password === null) return res.redirect('/invalid');

    let query = "select user_id,user_type_id from user where user_key = '" + username + "' and user_password = '" + password + "'";
    main.getDB().run(query).then(
        rows => {
            if (rows.length > 0) {
                const payload =
                    {
                    id: rows[0].user_id,
                    type: rows[0].user_type_id
                };

                let token = main.getJWT().sign(payload, main.getConfig().secret, {
                    expiresIn: main.getConfig().duration // expires in 15 minute
                });

                return main.output(res, 200, main.msg_ok, token);
            }
            else return res.redirect('/failed');
        }
    ).catch(err => {
        return res.redirect('/something_error');
    });
});

module.exports = router;