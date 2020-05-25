'use strict';

const tests = require('./tests');

const ExpressAdapter = require('./adapters/ExpressAdapter');
const FindMyWayAdapter = require('./adapters/FindMyWayAdapter');
const KoaRouterAdapter = require('./adapters/KoaRouterAdapter');
const KoaTreeAdapter = require('./adapters/KoaTreeAdapter');
const ServerRouterAdapter = require('./adapters/ServerRouterAdapter');
const TrekRouterAdapter = require('./adapters/TrekRouterAdapter');

/**
	* Notes:
	FindMyWay
		- You have to wrap the middleware so it works. When this happens, it can technically
		function with default arguments.
		- Regex handling is weird.
			- you want to declare a regular expression route, you must put the regular expression inside round parenthesis after the parameter name.
**/

const routerMap = {
	"express": ExpressAdapter,
	"koaRouter": KoaRouterAdapter,
	"koaTreeRouter": KoaTreeAdapter,
	"findMyWay": FindMyWayAdapter,
	"serverRouter": ServerRouterAdapter,
	"trekRouter": TrekRouterAdapter
};

const results = {};

(async function(){
	for(const routerLabel in routerMap){
		const Adapter = routerMap[routerLabel];

		results[routerLabel] = {};
		
		for(const testName in tests){
			results[routerLabel][testName] = await tests[testName](new Adapter());
		}
	}

	console.log(results);
})();