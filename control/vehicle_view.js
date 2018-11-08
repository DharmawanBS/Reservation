const Main = require('../core/main');
const main = new Main();
const router = main.getRouter();

router.get('/', function(req, res, next) {
    main.auth(req).then(
        rows => {
            if (rows != null) {
                console.log(rows.id);

                let query = "select * from view_vehicle";
                main.getDB().run(query).then(
                    rows => {
                        if (rows.length > 0) {
                            main.output(res,200,main.msg_ok,rows);
                        }
                        else res.redirect('/unauthorized');
                    }
                ).catch( err => {
                    //console.log(err);
                    res.redirect('/something_error');
                });
            }
            else res.redirect('/unauthorized');
        }
    ).catch( err => {
        //console.log(err);
        res.redirect('/unauthorized');
    });
});

module.exports = router;