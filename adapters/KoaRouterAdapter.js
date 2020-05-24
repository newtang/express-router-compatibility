'use strict';

const KoaRouter = require('koa-router');

class KoaRouterAdapter {

	constructor() {
		this._router = new KoaRouter();
	}

	get router(){
		return this._router;
	}

	getParam(param, [ctx]){
		return ctx.params[param];
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

module.exports = KoaRouterAdapter;