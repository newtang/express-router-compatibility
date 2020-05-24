'use strict';

const express = require('express');

class ExpressAdapter {

	constructor() {
		this._router = express.Router();
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
		return this._router;
	}
	
	send(msg, [, res]){
		res.send(msg);
	}

	next([, ,next]){
		next();
	}

}

module.exports = ExpressAdapter;