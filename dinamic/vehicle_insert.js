const Main = require('../core/main');
const main = new Main();
const router = main.getRouter();

router.post('/', function(req, res, next) {
    main.auth(req).then(
        rows => {
            if (rows != null) {

                let arr_column = [];
                let str_column = "";
                let obj_column = [];

                let query_alter = "alter table vehicle ";
                let start = true;

                let view_vehicle = main.inputCheck(res,req.body.view_vehicle,false,false,false,true,false);
                if (view_vehicle === null) {
                    return res.redirect('/invalid');
                }
                else {
                    view_vehicle.forEach(function (item) {
                        let view_vehicle_view = main.inputCheck(res, item.view_vehicle_view, false, false, true, false, false);
                        let view_vehicle_column = view_vehicle_view.toLowerCase();
                        view_vehicle_column = view_vehicle_column.replace(" ", "_");
                        let view_vehicle_type = main.inputCheck(res, item.view_vehicle_view, false, false, false, false, true);
                        let view_vehicle_show = main.inputCheck(res, item.view_vehicle_show, true, false, false, false, false);
                        let view_vehicle_nullable = main.inputCheck(res, item.view_vehicle_nullable, true, false, false, false, false);

                        view_vehicle_type = (view_vehicle_type === null) ? main.default_type : view_vehicle_type;
                        view_vehicle_show = (view_vehicle_show === null) ? main.default_show : view_vehicle_show;
                        view_vehicle_nullable = (view_vehicle_nullable === null) ? main.default_nullable : view_vehicle_nullable;

                        if (view_vehicle_view === null) {
                            return res.redirect('/invalid');
                        }
                        else {
                            view_vehicle_column = 'vu_' + view_vehicle_column;
                            if (arr_column.includes(view_vehicle_column)) {
                                return res.redirect('/invalid');
                            }
                            else {
                                arr_column.push(view_vehicle_column);
                                if (str_column === "") str_column = "'" + view_vehicle_column + "'";
                                else str_column = str_column + ",'" + view_vehicle_column + "'";
                                arr_column.push(view_vehicle_column);
                                obj_column.push([
                                    view_vehicle_view,
                                    view_vehicle_column,
                                    view_vehicle_type,
                                    view_vehicle_show,
                                    view_vehicle_nullable,
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
                                query_alter = query_alter + "add " + view_vehicle_column + " " + view_vehicle_type;
                            }
                        }
                    });

                    let query = "select count(*) as count from view_vehicle where view_vehicle_column in (" + str_column + ")";
                    main.getDB().run(query, [obj_column]).then(
                        rows => {
                            if (rows[0].count > 0) {
                                return res.redirect('/invalid');
                            }
                            else {
                                let query = "insert into view_vehicle (" +
                                    "view_vehicle_view," +
                                    "view_vehicle_column," +
                                    "view_vehicle_type," +
                                    "view_vehicle_show," +
                                    "view_vehicle_nullable," +
                                    "view_vehicle_is_active," +
                                    "view_vehicle_lastmodified," +
                                    "view_vehicle_lastmodified_id," +
                                    "view_vehicle_created," +
                                    "view_vehicle_created_id" +
                                    ") values ?";
                                main.getDB().run(query, [obj_column]).then(
                                    rows => {
                                        main.getDB().run(query_alter).then(
                                            rows => {
                                                return res.redirect('/created');
                                            }
                                        ).catch(err => {
                                            return res.redirect('/something_error');
                                        });
                                    }
                                ).catch(err => {
                                    return res.redirect('/something_error');
                                });
                            }
                        }
                    ).catch(err => {
                        return res.redirect('/something_error');
                    });
                }
            }
            else return res.redirect('/unauthorized');
        }
    ).catch( err => {
        return res.redirect('/unauthorized');
    });
});

module.exports = router;