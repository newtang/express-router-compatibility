'use strict';

const serverRouter = require('server-router');

class ServerRouterAdapter {

	constructor() {
		this._router = serverRouter(); //serverRouter({ default: '/404' })
	}

	get router(){
		return this._router;
	}

	getParam(param, [, , params]){
		return params[param];
	}

	paramFunction(){
		throw new Error("Not implemented");
	}

	buildGetRoute(path, ...callbacks){
		return this._router.route('GET', path, ...callbacks);
	}

	middleware() {
		return this._router.start();
	}
	
	send(msg, [, res]){
		res.send(msg);
	}

	next(){
		throw new Error("No next available");
	}

	paramNext(){
		throw new Error("Not implemented");
	}

}

module.exports = ServerRouterAdapter;