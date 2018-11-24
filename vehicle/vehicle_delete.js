const Main = require('../core/main');
const main = new Main();
const router = main.getRouter();

router.post('/', function(req, res, next) {
    main.auth(req).then(
        rows => {
            if (rows != null) {
                let vehicle_id = main.inputCheck(res,req.body.vehicle_id,false,false,true,false);

                if (vehicle_id === null){
                    return res.redirect('/invalid');
                }

                let query = "update vehicle set vehicle_is_active = 0 where vehicle_id = " + vehicle_id;

                main.getDB().run(query).then(
                    rows => {
                        return res.redirect('/updated');
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