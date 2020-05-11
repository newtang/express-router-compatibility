'use strict';

const express = require('express');
const KoaTreeRouter = require('koa-tree-router');
const tests = require('./tests');


const routerMap = {
	"express": {
		construct: () => express.Router(),
		middleware: (router) => router
	},
	"koaTreeRouter": {
		construct: () => new KoaTreeRouter(),
		middleware: (router) => router.routes()
	}
};

const results = {};


(async function(){
	for(const routerLabel in routerMap){
		const {construct, middleware} = routerMap[routerLabel];

		results[routerLabel] = {};
		
		for(const testName in tests){
			results[routerLabel][testName] = await tests[testName](construct(), middleware);
		}
	}

	console.log(results);
})();










