const Main = require('../core/main');
const main = new Main();
const router = main.getRouter();

router.post('/', function(req, res, next) {
    main.auth(req).then(
        rows => {
            if (rows != null) {
                let id = rows.id;

                let query = "select view_user_column,view_user_nullable from view_user where view_user_is_active = true";
                main.getDB().run(query).then(
                    rows => {
                        console.log(rows);
                        if (rows.length > 0) {
                            rows.forEach(function (item) {
                                let input = main.inputCheck(res,req.body[item.view_user_column],false,false,true,false,false);
                                if (item.view_user_nullable) {

                                }
                                console.log(item.view_user_column + " " + tes);
                            });
                        }
                        return res.redirect("/empty");
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