'use strict';
const express = require('express');
const request = require('supertest');

const { ClientRequest } = require('http');

module.exports = {
	allRoutes: function(adapter){
		/**
		 * Checks if router.route(path).all is available 
		 */
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
				resolve(false);
			}

			const resp = await request(app).get('/all');
			resolve(resp.body);
		});

		return p;
	},
	testCommonMethods: function(adapter){
		/**
		 * Checks if router.get, router.post, etc are available on the router object
		 */
		let valid = true;
		["get", "post", "put", "patch", "delete", "options"].forEach((verb) =>{
			if(typeof adapter.router[verb] !== "function"){
				valid = false;
			}
		});

		return valid
	},

	testUseMethod: function(adapter){
		/**
		 * Checks if router.use is an available function
		 */
		return typeof adapter.router.use === "function";
	},

	canBeUsedByExpress: function(adapter){
		/**
		 * Checks if the router itself can be used as an express middleware
		 * (as opposed to calling a method on the router)
		 */
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
		/**
		 * Checks if req, res, next are the arguments of a router callback.
		 */
		const p = new Promise(async (resolve, reject) => {
			const app = express();
			let value;
			adapter.buildGetRoute("/", function(...args){
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
		/**
		 * Checks if a router can handle static routes.
		 */
		const p = new Promise(async (resolve, reject) => {
			const app = express();
			adapter.buildGetRoute("/static", function(...args){
				adapter.send(true, args);
			})
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
			adapter.buildGetRoute("/:someparam", function(...args){
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
		adapter.buildGetRoute("/", ()=>{});

		try{
			adapter.buildGetRoute("/", ()=>{});
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

			adapter.buildGetRoute("/static", 
				function a(...args){
					firstMiddlewareUsed = true;
					try{
						adapter.next(args);
					}
					catch(err){
						adapter.send("", args);
					}
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
				adapter.buildGetRoute(/^\/api\/.+$/, function(...args){
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
				adapter.buildGetRoute("/ab+cd", function(...args){
					adapter.send(true, args);
				});
				adapter.buildGetRoute("/abbbcd", function(...args){
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
				adapter.buildGetRoute("*", function(...args){
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
