# express-router-compatibility
Testing the compatibility of different routers with express

`npm run start` will execute the tests and output the table. The tables below are just updated by copying and pasting the result.

Compatibility Tests
 | | [express](https://www.npmjs.com/package/express) | [koa-router](https://www.npmjs.com/package/koa-router) | [koa-tree-router](https://www.npmjs.com/package/koa-tree-router) | [find-my-way](https://www.npmjs.com/package/find-my-way) | [server-router](https://www.npmjs.com/package/server-router) | [trek-router](https://www.npmjs.com/package/trek-router) |
| --- | --- | --- | --- | --- | --- | --- |
router.route(path).all | true | false | false | false | false | false
common methods (.get, .post, etc) | true | true | true | true | false | false
router.use | true | true | false | false | false | false
express.use(router) | true | false | false | false | false | false
(req, res, next) => {} for middleware | true | false | false | true | false | true
static routes | true | true | true | true | true | true
router.param() | true | true | false | false | false | false
route parameters | true | true | true | true | true | true
duplicate routes | true | true | false | false | false | false
multiple middlewares | true | true | true | false | false | false
regex routes | true | true | false | false | false | false
path-to-regex style routes | true | false | false | false | false | false
wildcard (*) routes | true | true | false | true | true | true
express 404 handler | true | false | false | true | false | false

Other Tests
 | | [express](https://www.npmjs.com/package/express) | [koa-router](https://www.npmjs.com/package/koa-router) | [koa-tree-router](https://www.npmjs.com/package/koa-tree-router) | [find-my-way](https://www.npmjs.com/package/find-my-way) | [server-router](https://www.npmjs.com/package/server-router) | [trek-router](https://www.npmjs.com/package/trek-router) |
| --- | --- | --- | --- | --- | --- | --- |
order independent | false | false | false | true | true | true