const Main = require('../core/main');
const main = new Main();
const router = main.getRouter();

router.post('/', function(req, res, next) {
    main.auth(req).then(
        rows => {
            if (rows != null) {
                let user_type_id = main.inputCheck(res,req.body.user_type_id,false,true,false,false);
                let user_type_name = main.inputCheck(res,req.body.user_type_name,false,false,true,false);

                if (user_type_id === null || user_type_name === null){
                    return res.redirect('/invalid');
                }

                let query = "update user_type set user_type_name = '" + user_type_name + "', user_type_lastmodified = '" + main.getCurrentDate() + "', user_type_lastmodified_id = " + rows.id + " where user_type_is_active = 1 and user_type_id = " + user_type_id;

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