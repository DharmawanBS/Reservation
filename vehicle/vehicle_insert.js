const Main = require('../core/main');
const main = new Main();
const router = main.getRouter();

router.post('/', function(req, res, next) {
    main.auth(req).then(
        rows => {
            if (rows != null) {
                let vehicle_number = main.inputCheck(res,req.body.vehicle_number,false,false,true,false,false);
                let vehicle_feature = main.inputCheck(res,req.body.vehicle_feature,false,false,false,true,false);

                if (vehicle_feature === null || vehicle_number === null) {
                    return res.redirect('/invalid');
                }
                else {
                    let query = "insert into vehicle set ?";
                    let args = {
                        vehicle_number: vehicle_number,
                        vehicle_lastmodified: main.getCurrentDate(),
                        vehicle_lastmodified_id: rows.id,
                        vehicle_created: main.getCurrentDate(),
                        vehicle_created_id: rows.id
                    };

                    main.getDB().run(query, args).then(
                        rows => {
                            let id = rows.insertId;
                            new Promise(
                                function (resolve, reject) {
                                    let feature = [];
                                    vehicle_feature.forEach(function (item) {
                                        let vehicle_feature_key = main.inputCheck(res, item.vehicle_feature_key, false, false, true, false, false);
                                        let vehicle_feature_value = main.inputCheck(res, item.vehicle_feature_value, false, false, true, false, false);

                                        if (vehicle_feature_key === null || vehicle_feature_value === null) {
                                            let query = "delete from vehicle where vehicle_id = " + id;
                                            main.getDB().run(query);
                                        }
                                        else {
                                            feature.push([
                                                id,
                                                vehicle_feature_key,
                                                vehicle_feature_value
                                            ])
                                        }
                                    });
                                    resolve(feature);
                                }
                            ).then( fitur => {
                                if (fitur.length !== vehicle_feature.length) {
                                    return res.redirect('/invalid');
                                }
                                else {
                                    let query = "insert into vehicle_feature values ?";
                                    main.getDB().run(query, [fitur]).then(
                                        rows => {
                                            return res.redirect('/created');
                                        }
                                    ).catch(err => {
                                        return res.redirect('/something_error');
                                    });
                                }
                            }).catch( err => {
                                console.log(err);
                            });
                        }
                    ).catch( err => {
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