const Main = require('../core/main');
const main = new Main();
const router = main.getRouter();

router.post('/', function(req, res, next) {
    main.auth(req).then(
        rows => {
            if (rows != null) {

                let arr_column = [];
                let obj_column = [];

                let query_alter = "alter table user ";
                let start = true;

                let view_user = main.inputCheck(res,req.body.view_user,false,false,false,true,false);
                view_user.forEach(function (item) {
                    let view_user_view = main.inputCheck(res,item.view_user_view,false,false,true,false,false);
                    let view_user_column = view_user_view.toLowerCase();
                    view_user_column = view_user_column.replace(" ","_");
                    let view_user_type = main.inputCheck(res,item.view_user_view,false,false,false,false,true);
                    let view_user_show = main.inputCheck(res,item.view_user_show,true,false,false,false,false);
                    let view_user_nullable = main.inputCheck(res,item.view_user_nullable,true,false,false,false,false);

                    view_user_type = (view_user_type === null) ? main.default_type : view_user_type;
                    view_user_show = (view_user_show === null) ? main.default_show : view_user_show;
                    view_user_nullable = (view_user_nullable === null) ? main.default_nullable : view_user_nullable;

                    if (view_user_view === null) {
                        return res.redirect('/invalid');
                    }
                    else {
                        view_user_column = 'vu_' + view_user_column;
                        if (arr_column.includes(view_user_column)) {
                            return res.redirect('/invalid');
                        }
                        else {
                            arr_column.push(view_user_column);
                            obj_column.push([
                                view_user_view,
                                view_user_column,
                                view_user_type,
                                view_user_show,
                                view_user_nullable,
                                true,
                                main.getCurrentDate(),
                                rows.id,
                                main.getCurrentDate(),
                                rows.id
                            ]);

                            if (start) {
                                start = false;
                            }
                            else {
                                query_alter = query_alter + ",";
                            }
                            query_alter = query_alter + "add " + view_user_column + " " + view_user_type;
                        }
                    }
                });

                let query = "insert into view_user (" +
                    "view_user_view," +
                    "view_user_column," +
                    "view_user_type," +
                    "view_user_show," +
                    "view_user_nullable," +
                    "view_user_is_active," +
                    "view_user_lastmodified," +
                    "view_user_lastmodified_id," +
                    "view_user_created," +
                    "view_user_created_id" +
                    ") values ?";
                main.getDB().run(query,[obj_column]).then(
                    rows => {
                        main.getDB().run(query_alter).then(
                            rows => {
                                return res.redirect('/created');
                            }
                        ).catch( err => {
                            return res.redirect('/something_error');
                        });
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