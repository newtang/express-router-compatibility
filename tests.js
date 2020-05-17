'use strict';
const express = require('express');
const request = require('supertest');

const { ClientRequest } = require('http');

module.exports = {
	allRoutes: function(router, {middleware, send}){
		const p = new Promise(async (resolve, reject) => {
			const app = express();
			try{
				router.route("/all")
					.all(function(...args){
						send(true, args);
					});
				app.use(middleware(router));
			}
			catch(err){
				resolve(false);
			}

			const resp = await request(app).get('/all');
			resolve(resp.body);
		});

		return p;
	},
	testCommonMethods: function(router){
		let valid = true;
		["get", "post", "put", "patch", "delete", "options"].forEach((verb) =>{
			if(typeof router[verb] !== "function"){
				valid = false;
			}
		});

		return valid
	},

	testUseMethod: function(router){
		return typeof router.use === "function";
	},

	canBeUsedByExpress: function(router){
		const app = express();
		try{
			app.use(router);
		}
		catch(err){
			return false;
		}
		return true;
	},

	standardFunctionSignature: async function(router, {middleware, send}){
		const p = new Promise(async (resolve, reject) => {
			const app = express();
			let value;
			router.get("/", function(...args){
				const [req, res, next] = args;

				const isRes = res && typeof res.send === "function";
				const nextIsFunction = typeof next === "function";

				value = isRes && nextIsFunction;
				send(value, args);
			});
			app.use(middleware(router));

			const resp = await request(app).get('/');
			resolve(resp.body);
		});

		return p;
	},

	staticRoutes: async function(router, {middleware, send}){
		const p = new Promise(async (resolve, reject) => {
			const app = express();
			router.get("/static", function(...args){
				send(true, args);
			});
			app.use(middleware(router));

			const resp = await request(app).get('/static');
			resolve(resp.body);
		});

		return p;
	},

	paramRoutes: async function(router, {middleware, getParam, send}){
		const p = new Promise(async (resolve, reject) => {
			const app = express();
			let value;
			router.get("/:someparam", function(...args){
				const value = getParam("someparam", args);
				send(value, args);
			});
			app.use(middleware(router));

			const resp = await request(app).get('/hello');
			resolve(resp.text === "hello");
		});

		return p;
	},

	sameRouteTwice: function(router, {routeArgs} ){
		const app = express();
		router.get("/", ()=>{});

		try{
			router.get("/", ()=>{});
		}
		catch(err){
			return false;
		}

		return true;
	},

	multipleMiddlewares: function(router, { middleware, next, send }){
		const p = new Promise(async (resolve, reject) => {
			const app = express();
			let firstMiddlewareUsed = false;;

			router.get("/static", 
				function(...args){
					firstMiddlewareUsed = true;
					next(args);
				},
				function(...args){
					send(firstMiddlewareUsed, args);
				}
			);
			app.use(middleware(router));

			const resp = await request(app).get('/static');
			resolve(resp.body);
		});

		return p;
	},

	regexRoutes: async function(router, {middleware, send}){
		const p = new Promise(async (resolve, reject) => {
			const app = express();
			try{
				router.get(/^\/api\/.+$/, function(...args){
					send(true, args);
				});
				app.use(middleware(router));
			}
			catch(err){
				resolve(false);
			}

			const resp = await request(app).get('/api/somevalue');
			resolve(resp.body);
		});

		return p;
	},

	pathToRegexRoutes: async function(router, {middleware, send}){
		const p = new Promise(async (resolve, reject) => {
			const app = express();
			try{
				router.get("/ab+cd", function(...args){
					send(true, args);
				});
				router.get("/abbbcd", function(...args){
					send(false, args);
				});
				app.use(middleware(router));
			}
			catch(err){
				resolve(false);
			}

			const resp = await request(app).get('/abbbcd');
			resolve(resp.body);
		});

		return p;
	},
	starRoute: async function(router, {middleware, send}){
		const p = new Promise(async (resolve, reject) => {
			const app = express();
			try{
				router.get("*", function(...args){
					send(true, args);
				});
				app.use(middleware(router));
			}
			catch(err){
				resolve(false);
			}

			const resp = await request(app).get('/anything');
			resolve(resp.body);
		});

		return p;
	}

};
