const Main = require('../core/main');
const main = new Main();
const router = main.getRouter();

router.get('/', function(req, res, next) {
    main.output(res,404,main.msg_invalid,null);
});

module.exports = router;