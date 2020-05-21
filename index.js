'use strict';

//routers
const express = require('express');
const KoaTreeRouter = require('koa-tree-router');
const KoaRouter = require('koa-router');
const FindMyWay = require('find-my-way');
const tests = require('./tests');

/**
	* Notes:
	FindMyWay
		- You have to wrap the middleware so it works. When this happens, it can technically
		function with default arguments.
		- Regex handling is weird.
			- you want to declare a regular expression route, you must put the regular expression inside round parenthesis after the parameter name.
**/



const routerMap = {
	"express": {
		construct: () => express.Router(),
		getParam: (param, [req]) => {
			return req.params[param];
		},
		middleware: (router) => router,
		send:(msg, [, res]) => {
			res.send(msg);
		},
		next:([, ,next]) =>{
			next();
		}
	},
	"find-my-way":{
		construct: () => FindMyWay({allowUnsafeRegex: true}),
		getParam: (param, [req]) => {
			return req.params[param];
		},
		middleware: (router) => {
			return function(...args){
				const [req] = args;
				const handle = router.find(req.method, req.path);
				if (!handle) {
			      return router.defaultRoute && router.defaultRoute(...reqs);
			    }
			    req.params = handle.params;
			    return handle.handler(...args);
			}
		},
		next:([, ,next]) =>{
			next();
		},
		send: (msg, [, res]) => {
			res.send(msg);
		},
	},
	"koaRouter": {
		construct: () => new KoaRouter(),
		getParam: (param, [ctx]) => {
			return ctx.params[param];
		},
		middleware: (router) => router.routes(),
		send: (msg, [ctx]) => {
			ctx.res.send(msg);
		},
		next:([, next]) =>{
			next();
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
		},
		next:([, next]) =>{
			next();
		}
	},

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










