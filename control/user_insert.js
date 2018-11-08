const Main = require('../core/main');
const main = new Main();
const router = main.getRouter();

router.post('/', function(req, res, next) {
    main.auth(req).then(
        rows => {
            if (rows != null) {

                let arr_column = [];
                let obj_column = [];

                let view_user = main.inputCheck(res,req.body.view_user,false,false,false,true);
                view_user.forEach(function (item) {
                    let view_user_column = main.inputCheck(res,item.view_user_column,false,false,false,false);
                    let view_user_type = main.inputCheck(res,item.view_user_type,false,false,true,false);
                    let view_user_show = main.inputCheck(res,item.view_user_show,true,false,false,false);
                    let view_user_nullable = main.inputCheck(res,item.view_user_nullable,true,false,false,false);

                    view_user_type = (view_user_type === null) ? main.default_type : view_user_type;
                    view_user_show = (view_user_show === null) ? main.default_show : view_user_show;
                    view_user_nullable = (view_user_nullable === null) ? main.default_nullable : view_user_nullable;

                    if (view_user_column === null) {
                        return res.redirect('/invalid');
                    }
                    else {
                        view_user_column = 'vu_' + view_user_column;
                        if (arr_column.includes(view_user_type)) {
                            return res.redirect('/invalid');
                        }
                        else {
                            arr_column.push(view_user_type);
                            obj_column.push({
                                view_user_column: view_user_column,
                                view_user_type: view_user_type,
                                view_user_show: view_user_show,
                                view_user_nullable: view_user_nullable,
                                view_user_is_active: true
                            });
                        }
                    }
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