'use strict';
const express = require('express');
const request = require('supertest');

const { ClientRequest } = require('http');

module.exports = {
	allRoutes: function(adapter){
		const p = new Promise(async (resolve, reject) => {
			const app = express();
			try{
				adapter.router.route("/all")
					.all(function(...args){
						adapter.send(true, args);
					});
				app.use(adapter.middleware());
			}
			catch(err){
				console.log(err);
				resolve(false);
			}

			const resp = await request(app).get('/all');
			resolve(resp.body);
		});

		return p;
	},
	testCommonMethods: function(adapter){
		let valid = true;
		["get", "post", "put", "patch", "delete", "options"].forEach((verb) =>{
			if(typeof adapter.router[verb] !== "function"){
				valid = false;
			}
		});

		return valid
	},

	testUseMethod: function(adapter){
		return typeof adapter.router.use === "function";
	},

	canBeUsedByExpress: function(adapter){
		const app = express();
		try{
			app.use(adapter.router);
		}
		catch(err){
			return false;
		}
		return true;
	},

	standardFunctionSignature: async function(adapter){
		const p = new Promise(async (resolve, reject) => {
			const app = express();
			let value;
			adapter.router.get("/", function(...args){
				const [req, res, next] = args;

				const isRes = res && typeof res.send === "function";
				const nextIsFunction = typeof next === "function";

				value = isRes && nextIsFunction;
				adapter.send(value, args);
			});
			app.use(adapter.middleware());

			const resp = await request(app).get('/');
			resolve(resp.body);
		});

		return p;
	},

	staticRoutes: async function(adapter){
		const p = new Promise(async (resolve, reject) => {
			const app = express();
			adapter.router.get("/static", function(...args){
				adapter.send(true, args);
			});
			app.use(adapter.middleware());

			const resp = await request(app).get('/static');
			resolve(resp.body);
		});

		return p;
	},

	paramRoutes: async function(adapter){
		const p = new Promise(async (resolve, reject) => {
			const app = express();
			let value;
			adapter.router.get("/:someparam", function(...args){
				const value = adapter.getParam("someparam", args);
				adapter.send(value, args);
			});
			app.use(adapter.middleware());

			const resp = await request(app).get('/hello');
			resolve(resp.text === "hello");
		});

		return p;
	},

	sameRouteTwice: function(adapter ){
		const app = express();
		adapter.router.get("/", ()=>{});

		try{
			adapter.router.get("/", ()=>{});
		}
		catch(err){
			return false;
		}

		return true;
	},

	multipleMiddlewares: function(adapter){
		const p = new Promise(async (resolve, reject) => {
			const app = express();
			let firstMiddlewareUsed = false;
			let secondMiddlewareUsed = false;

			adapter.router.get("/static", 
				function a(...args){
					firstMiddlewareUsed = true;
					adapter.next(args);
				},
				function b(...args){
					secondMiddlewareUsed = true;
					adapter.send(firstMiddlewareUsed, args);
				}
			);
			app.use(adapter.middleware());

			await request(app).get('/static');
			resolve(firstMiddlewareUsed && secondMiddlewareUsed);
		});

		return p;
	},

	regexRoutes: async function(adapter){
		const p = new Promise(async (resolve, reject) => {
			const app = express();
			try{
				adapter.router.get(/^\/api\/.+$/, function(...args){
					adapter.send(true, args);
				});
				app.use(adapter.middleware());
			}
			catch(err){
				resolve(false);
			}

			const resp = await request(app).get('/api/somevalue');
			resolve(resp.body);
		});

		return p;
	},

	pathToRegexRoutes: async function(adapter){
		const p = new Promise(async (resolve, reject) => {
			const app = express();
			try{
				adapter.router.get("/ab+cd", function(...args){
					adapter.send(true, args);
				});
				adapter.router.get("/abbbcd", function(...args){
					adapter.send(false, args);
				});
				app.use(adapter.middleware());
			}
			catch(err){
				resolve(false);
			}

			const resp = await request(app).get('/abbbcd');
			resolve(resp.body);
		});

		return p;
	},
	starRoute: async function(adapter){
		const p = new Promise(async (resolve, reject) => {
			const app = express();
			try{
				adapter.router.get("*", function(...args){
					adapter.send(true, args);
				});
				app.use(adapter.middleware());
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
