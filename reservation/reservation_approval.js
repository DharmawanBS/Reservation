const Main = require('../core/main');
const main = new Main();
const router = main.getRouter();

router.post('/', function(req, res, next) {
    main.auth(req).then(
        rows => {
            if (rows != null) {
                let reservation_id = main.inputCheck(res,req.body.reservation_id,false,true,false,false);

                if (reservation_id === null){
                    return res.redirect('/invalid');
                }

                let query = "update reservation set reservation_is_approved = 1, reservation_approved_datetime = '" + main.getCurrentDate() + "', reservation_approved_id = " + rows.id + " where reservation_is_active = 1 and reservation_id = " + reservation_id;

                main.getDB().run(query).then(
                    rows => {
                        return res.redirect('/updated');
                    }
                ).catch( err => {
                    //console.log(err);
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