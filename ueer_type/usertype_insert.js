const Main = require('../core/main');
const main = new Main();
const router = main.getRouter();

router.post('/', function(req, res, next) {
    main.auth(req).then(
        rows => {
            if (rows != null) {
                let user_type_name = main.inputCheck(res,req.body.user_type_name,false,false,true,false);

                if (user_type_name === null){
                    return res.redirect('/invalid');
                }

                let query = "insert into user_type set ?";
                let args = {
                    user_type_name: user_type_name,
                    user_type_lastmodified: user_type_lastmodified,
                    user_type_lastmodified_id: rows.id,
                    user_type_created: user_type_created,
                    user_type_created_id: rows.id
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