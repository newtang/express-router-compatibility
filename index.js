const express = require('express');
const port = 3000;
const KoaTreeRouter = require('koa-tree-router');
const request = require('supertest');


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
		const constructRouter = routerMap[routerLabel].construct;
		const middlewareFxn = routerMap[routerLabel].middleware;

		if(!results[routerLabel]){
			results[routerLabel] = {};
		}
		results[routerLabel].standardMethods = testStandardMethods(constructRouter());
		results[routerLabel].useMethod = testUseMethod(constructRouter());
		results[routerLabel].canBeUsedByExpress = canBeUsedByExpress(constructRouter());
		results[routerLabel].standardFunctionSignature = await standardFunctionSignature(constructRouter(), middlewareFxn);
		results[routerLabel].sameRouteTwice = sameRouteTwice(constructRouter());
	}

	console.log(results);
})();





function testStandardMethods(router){
	let valid = true;
	["get", "post", "put", "patch", "delete", "options"].forEach((verb) =>{
		if(typeof router[verb] !== "function"){
			valid = false;
		}
	});

	return valid
}

function testUseMethod(router){
	return typeof router.use === "function";
}

function canBeUsedByExpress(router){
	const app = express();
	try{
		app.use(router);
	}
	catch(err){
		return false;
	}
	return true;
}

async function standardFunctionSignature(router, middlewareFxn){
	const p = new Promise((resolve, reject) => {
		const app = express();
		router.get("/", function(req, res, next){
			resolve(typeof next === "function");
		});
		app.use(middlewareFxn(router));

		request(app).get('/').end();
	});

	return p;
}

function sameRouteTwice(router){
	const app = express();
	router.get("/", ()=>{});

	try{
		router.get("/", ()=>{});
	}
	catch(err){
		return false;
	}

	return true;
}











