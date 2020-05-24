'use strict';

const KoaTreeRouter = require('koa-tree-router');

class KoaTreeAdapter {

	constructor() {
		this._router = new KoaTreeRouter();
	}

	get router(){
		return this._router;
	}

	getParam(param, [ctx]){
		return ctx.params[param];
	}

	buildGetRoute(path, ...callbacks){
		return this._router.get(path, ...callbacks);
	}

	middleware() {
		return this._router.routes();
	}
	
	send(msg, [ctx]){
		ctx.res.send(msg);
	}

	next([, next]){
		next();
	}

}

module.exports = KoaTreeAdapter;