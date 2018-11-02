const Main = require('../core/main');
const main = new Main();
const router = main.getRouter();

router.get('/', function(req, res, next) {
    main.output(res,204,main.msg_empty,null);
});

module.exports = router;