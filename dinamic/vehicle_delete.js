const Main = require('../core/main');
const main = new Main();
const router = main.getRouter();

router.post('/', function(req, res, next) {
    main.auth(req).then(
        rows => {
            if (rows != null) {
                let view_vehicle_id = main.inputCheck(res,req.body.view_vehicle_id,false,false,false,true,false);
                if (view_vehicle_id === null) {
                    return res.redirect('/invalid');
                }
                else {
                    let query = "update view_vehicle set view_vehicle_is_active = false,view_vehicle_lastmodified = " + main.getCurrentDate() + ",view_vehicle_lastmodified_id = " + rows.id + " where view_vehicle_id in (" + view_vehicle_id + ")";
                    main.getDB().run(query,[obj_column]).then(
                        rows => {
                            return res.redirect('/updated');
                        }
                    ).catch( err => {
                        console.log(err);
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