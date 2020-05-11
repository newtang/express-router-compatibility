'use strict';
const express = require('express');
const request = require('supertest');

module.exports = {
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

	standardFunctionSignature: async function(router, middlewareFxn){
		const p = new Promise((resolve, reject) => {
			const app = express();
			router.get("/", function(req, res, next){
				resolve(typeof next === "function");
			});
			app.use(middlewareFxn(router));

			request(app).get('/').end();
		});

		return p;
	},

	sameRouteTwice: function(router){
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
};
