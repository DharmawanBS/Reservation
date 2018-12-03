const Main = require('../core/main');
const main = new Main();
const router = main.getRouter();

router.post('/', function(req, res, next) {
    main.auth(req).then(
        rows => {
            if (rows != null) {
                let reservation_code = main.inputCheck(res,req.body.reservation_code,false,false,true,false);
                let price_id = main.inputCheck(res,req.body.price_id,false,true,false,false);
                let vehicle_id = main.inputCheck(res,req.body.vehicle_id,false,true,false,false);
                let reservation_start = main.inputCheck(res,req.body.reservation_start,false,false,true,false);
                let reservation_end = main.inputCheck(res,req.body.reservation_end,false,false,true,false);

                if (reservation_code === null || price_id === null || vehicle_id === null){
                    return res.redirect('/invalid');
                }

                let query = "insert into reservation set ?";
                let args = {
                    reservation_code: reservation_code,
                    reservation_datetime: main.getCurrentDate(),
                    user_id: rows.id,
                    price_id: price_id,
                    vehicle_id: vehicle_id,
                    reservation_start: reservation_start,
                    reservation_end: reservation_end
                };

                main.getDB().run(query, args).then(
                    rows => {
                        return res.redirect('/created');
                    }
                ).catch( err => {
                    return res.redirect('/something_error');
                });
            }
            else return res.redirect('/unauthorized');
        }
    ).catch( err => {
        //console.log(err);
        return res.redirect('/unauthorized');
    });
});

module.exports = router;