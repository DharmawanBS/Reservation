const Main = require('../core/main');
const main = new Main();
const router = main.getRouter();

router.get('/', function(req, res, next) {
    main.auth(req).then(
        rows => {
            let id = rows.id;
            if (rows != null) {
                let query = "select view_user_column from view_user where view_user_show = true and view_user_is_active = true";
                main.getDB().run(query).then(
                    rows => {
                        if (rows.length > 0) {
                            let select = '' +
                                'user_type.user_type_name,' +
                                'user.user_id,' +
                                'user.user_type_id';
                            rows.forEach(function (item) {
                                select = select + ",user." + item.view_user_column;
                            });
                            let query = "select " + select + " from user,user_type where user.user_type_id = user_type.user_type_id and user.user_is_active = true and user.user_id = " + id;
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