'use strict';

const express = require('express');
const KoaTreeRouter = require('koa-tree-router');
const tests = require('./tests');


const routerMap = {
	"express": {
		construct: () => express.Router(),
		getParam: (param, [req]) => {
			return req.params[param];
		},
		middleware: (router) => router,
		send:(msg, [, res]) => {
			res.send(msg);
		}
	},
	"koaTreeRouter": {
		construct: () => new KoaTreeRouter(),
		getParam: (param, [ctx]) => {
			return ctx.params[param];
		},
		middleware: (router) => router.routes(),
		send: (msg, [ctx]) => {
			ctx.res.send(msg);
		}
	}
};

const results = {};


(async function(){
	for(const routerLabel in routerMap){
		const adapter = routerMap[routerLabel];
		const {construct} = adapter;

		results[routerLabel] = {};
		
		for(const testName in tests){
			results[routerLabel][testName] = await tests[testName](construct(), adapter);
		}
	}

	console.log(results);
})();










