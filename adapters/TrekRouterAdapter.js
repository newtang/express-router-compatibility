'use strict';

const TrekRouter = require('trek-router');

class TrekRouterAdapter {

	constructor() {
		this._router = new TrekRouter(); 
	}

	get router(){
		return this._router;
	}

	getParam(param, [req]){
		return req.params[param];
	}

	paramFunction(){
		throw new Error("Not implemented");
	}

	buildGetRoute(path, ...callbacks){
		return this._router.add('GET', path, ...callbacks);
	}

	middleware() {
		const router = this.router;
		return function(...args) {
		  const [req] = args;
		  let result = router.find(req.method, req.url);
		  if (result) {
		  	if(result[1]){
		  		const params = {};
		  		result[1].forEach(({name, value}) => params[name] = value);
		  		req.params = params;
		  	}
		    return result[0](...args);
		  }
		  // finalhandler(req, res);
		}
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

module.exports = TrekRouterAdapter;