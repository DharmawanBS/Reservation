const Main = require('../core/main');
const main = new Main();
const router = main.getRouter();

router.get('/', function(req, res, next) {
    main.output(res,500,main.msg_something_error,null);
});

module.exports = router;