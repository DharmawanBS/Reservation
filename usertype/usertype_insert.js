const Main = require('../core/main');
const main = new Main();
const router = main.getRouter();

router.post('/', function(req, res, next) {
    main.auth(req).then(
        rows => {
            if (rows != null) {

                let view_user = main.inputCheck(res,req.body.view_user,false,false,false,true);

                let query = "insert into user_type set ?";
                let args = {
                    user_type_name: view_user,

                }

                main.getDB().run(query).then(
                    rows => {
 /*                       if (rows.length > 0) {
                            return main.output(res,200,main.msg_ok,rows);
                        }
                        else return res.redirect('/empty'); **/
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