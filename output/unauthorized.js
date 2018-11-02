const Main = require('../core/main');
const main = new Main();
const router = main.getRouter();

router.get('/', function(req, res, next) {
    main.output(res,401,main.msg_unauthorized,null);
});

module.exports = router;