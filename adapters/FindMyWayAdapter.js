'use strict';

const FindMyWay = require('find-my-way');

class FindMyWayAdapter {

	constructor() {
		this._router = FindMyWay({allowUnsafeRegex: true});
	}

	get router(){
		return this._router;
	}

	getParam(param, [req]){
		return req.params[param];
	}

	buildGetRoute(path, ...callbacks){
		return this._router.get(path, ...callbacks);
	}

	middleware() {
		const router = this.router;
		return function(...args){
			const [req, , next] = args;
			const handle = router.find(req.method, req.path);
			if (!handle) {
		      return next();
		    }
		    req.params = handle.params;
		    return handle.handler(...args);
		}
	}
	
	send(msg, [, res]){
		res.send(msg);
	}

	next([, ,next]){
		next();
	}

}

module.exports = FindMyWayAdapter;