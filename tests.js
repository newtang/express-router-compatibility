'use strict';
const express = require('express');
const request = require('supertest');

const { ClientRequest } = require('http');

module.exports = {
	allRoutes: function(adapter){
		/**
		 * Checks if router.route(path).all is available 
		 */
		return new Promise(async (resolve, reject) => {
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
		return new Promise(async (resolve, reject) => {
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

		
	},

	staticRoutes: async function(adapter){
		/**
		 * Checks if a router can handle static routes.
		 */
		return new Promise(async (resolve, reject) => {
			const app = express();
			adapter.buildGetRoute("/static", function(...args){
				adapter.send(true, args);
			})
			app.use(adapter.middleware());
			const resp = await request(app).get('/static');
			resolve(resp.body);
		});

		
	},

	paramRoutes: async function(adapter){
		/**
		 * Checks if a router can handle parameterized routes.
		 */
		return new Promise(async (resolve, reject) => {
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
	},

	sameRouteTwice: function(adapter){
		/**
		 * Checks if a router allows and executes duplicate routes.
		 */
		return new Promise(async (resolve, reject) => {
			const app = express();
			let firstCalled = false;
			let secondCalled = false

			adapter.buildGetRoute("/", async function (...args){
				firstCalled = true;
				try{
					// next is async to catch an unhandled rejection from Koa. It shouldn't make
					// any difference to the other adapters.
					await adapter.next(args);
				}
				catch(err){
					adapter.send("", args);
				}
			});
			try{
				adapter.buildGetRoute("/", function (...args){
					secondCalled = true;
					adapter.send("", args);
				});
			}
			catch(err){
				resolve(false);
			}
			app.use(adapter.middleware());

			await request(app).get('/');
			resolve(firstCalled && secondCalled);
		});
	},

	multipleMiddlewares: function(adapter){
		/**
		 * Checks if a router allows for multiple middlewares.
		 */
		return new Promise(async (resolve, reject) => {
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

		
	},
	regexRoutes: async function(adapter){
		/**
		 * Checks if a router allows for regular expression routes
		 */
		return new Promise(async (resolve, reject) => {
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
	},

	orderIndependent: async function(adapter){
		/**
		 * Checks if a router allows for regular expression routes
		 */
		return new Promise(async (resolve, reject) => {
			const app = express();
			try{
				adapter.buildGetRoute("/:someParam", function(...args){
					adapter.send(false, args);
				});
				adapter.buildGetRoute("/test", function(...args){
					adapter.send(true, args);
				});
				app.use(adapter.middleware());
			}
			catch(err){
				resolve(false);
			}

			const resp = await request(app).get('/test');
			resolve(resp.body);
		});	
	},
	pathToRegexRoutes: async function(adapter){
		/**
		 * Checks if a router handles "path-to-regex" styles routes
		 */
		return new Promise(async (resolve, reject) => {
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
	},
	starRoute: async function(adapter){
		/**
		 * Checks if a router handles wildcard routes
		 */
		return new Promise(async (resolve, reject) => {
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
	},
	compatibleWithExpress404: function(adapter){
		/**
		 * Checks if a router works with Express' way of handling 404s.
		 */
		return new Promise(async (resolve, reject) => {
			const message404 = "Not found";
			const app = express();

			try{
				adapter.buildGetRoute("/", function(...args){
					console.log("route");
					adapter.send(true, args);
				});
				app.use(adapter.middleware());
				app.use(function (req, res, next) {
				  res.status(404).send(message404);
				})
				app.use(function (err, req, res, next) {
				  //we need this if express throws an exception, trying to use our middleware
				  res.status(500).send('Something broke!')
				})
			}
			catch(err){
				resolve(false);
			}

			const resp = await request(app).get('/not_there');
			resolve(resp.status === 404 && resp.text === message404);
		});
	}
};
