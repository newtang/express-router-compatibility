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