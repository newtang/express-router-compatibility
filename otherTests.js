'use strict';
const express = require('express');
const request = require('supertest');

module.exports = {
	"order independent": async function(adapter){
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
}