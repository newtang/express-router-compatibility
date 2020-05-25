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

	paramFunction(){
		throw new Error("Not implemented");
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

	async next([, next]){
		await next();
	}

	paramNext(){
		throw new Error("Not implemented");
	}

}

module.exports = KoaTreeAdapter;