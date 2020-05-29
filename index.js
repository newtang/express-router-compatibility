'use strict';

const tests = require('./tests');

const ExpressAdapter = require('./adapters/ExpressAdapter');
const FindMyWayAdapter = require('./adapters/FindMyWayAdapter');
const KoaRouterAdapter = require('./adapters/KoaRouterAdapter');
const KoaTreeAdapter = require('./adapters/KoaTreeAdapter');
const ServerRouterAdapter = require('./adapters/ServerRouterAdapter');
const TrekRouterAdapter = require('./adapters/TrekRouterAdapter');
const npmUrl = 'https://www.npmjs.com/package/';

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
	"koa-router": KoaRouterAdapter,
	"koa-tree-router": KoaTreeAdapter,
	"find-my-way": FindMyWayAdapter,
	"server-router": ServerRouterAdapter,
	"trek-router": TrekRouterAdapter
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

	const includeLink = true;
	console.log(convertToTable(results, includeLink));
})();

function buildNpmMarkdownLink(router){
	return `[${router}](${npmUrl}${router})`;
}

function convertToTable(results, includeLink=true){
	
	const routers = Object.keys(results);
	const firstRouter = routers[0];

	const mapper = includeLink
		? router => buildNpmMarkdownLink(router)
		: router => router;


	const header = `| | ${routers.map(mapper).join(' | ')} |`;
	const dividers =`| --- | ${routers.map(r => '---').join(' | ')} |`;
	const rows = [];

	const testNames = Object.keys(results[firstRouter]);

	for(const test of testNames){
		const row = [test];
		for(const router of routers){
			row.push(results[router][test]);
		}
		rows.push(row.join(' | '));
	}
	const allData = rows.join('\n');

	return `${header}\n${dividers}\n${allData}`;
}





