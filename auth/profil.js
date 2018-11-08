const Main = require('../core/main');
const main = new Main();
const router = main.getRouter();

router.get('/', function(req, res, next) {
    main.auth(req).then(
        rows => {
            if (rows != null) {

                let query = "select user.*,user_type.user_type_name from user,user_type where user.user_type_id = user_type.user_type_id and user.user_id = " + rows.id;
                main.getDB().run(query).then(
                    rows => {
                        if (rows.length > 0) {
                            return main.output(res,200,main.msg_ok,rows);
                        }
                        else return res.redirect('/unauthorized');
                    }
                ).catch( err => {
                    return res.redirect('/something_error');
                });
            }
            else return res.redirect('/unauthorized');
        }
    ).catch( err => {
        return res.redirect('/unauthorized');
    });
});

module.exports = router;