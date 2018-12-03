const Main = require('../core/main');
const main = new Main();
const router = main.getRouter();

router.post('/', function(req, res, next) {
    main.auth(req).then(
        rows => {
            if (rows != null) {
                let vehicle_id = main.inputCheck(res,req.body.vehicle_id,false,true,false,false);
                let vehicle_number = main.inputCheck(res,req.body.vehicle_number,false,false,true,false);
                let vehicle_feature_key = main.inputCheck(res,req.body.vehicle_feature_key,false,false,true,false);
                let vehicle_feature_value = main.inputCheck(res,req.body.vehicle_feature_value,false,false,true,false);

                if (vehicle_id === null || vehicle_number === null){
                    return res.redirect('/invalid');
                }

                let query = "update vehicle, vehicle_feature set vehicle_number = '" + vehicle_number + "', vehicle_lastmodified = '" + main.getCurrentDate() + "', vehicle_lastmodified_id = " + rows.id + ", vehicle_feature_value = '" + vehicle_feature_value + "' where vehicle_is_active = 1 and vehicle_id = " + vehicle_id + " and vehicle_feature_key = '" + vehicle_feature_key + "' and vehicle_feature_id = vehicle_id";

                main.getDB().run(query).then(
                    rows => {
                        return res.redirect('/updated');
                    }
                ).catch( err => {
                    console.log(err);
                    return res.redirect('/something_error');
                });
            }
            else return res.redirect('/unauthorized');
        }
    ).catch( err => {
        console.log(err);
        return res.redirect('/unauthorized');
    });
});

module.exports = router;