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

	paramFunction([req, res, next, paramValue]){
		return paramValue;
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

	paramNext([, ,next]){
		next();
	}

}

module.exports = ExpressAdapter;