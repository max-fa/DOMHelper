"use strict";
var Ajax = window.DOMHelper.Ajax;
	/*Ajax.request({
		url: "http://localhost/my_docs/resources/DOMHelper/test.php",
		method: "POST",
		data: [1,2,3],
		dataFilter: function(data) {
			return JSON.stringify(data);
		},
		success: function(request) {
			console.log(request);
		},
		failure: function(request) {
			console.log(request);
		},
		complete: function(request) {
			console.log(request);
		}
	});*/
	
	/*Ajax.request("http://localhost/my_docs/resources/DOMHelper/test.php","post",[1,2,3],function(request) {
		console.log(request);
	},
	function(request) {
		console.log(request);
	},
	function(data) {
		return JSON.stringify(data);
	},
	null,
	null,
	function(response) {
		console.log(response);
	}
	);*/
	
	var formComponent = DOMHelper.Component.create("testForm");
	formComponent.directives.register("onClick",function(jQuery) {
		var $ = jQuery;
		$(this).on("click",function(evt) {
			alert("You're about to submit the form");
		});		
	});
	
	var MainComponent = DOMHelper.Component.create("MainComponent");
	MainComponent.directives.register("alerty",function(jQuery) {
		var $ = jQuery;
		$(this).on("click",function(evt) {
			alert("Boo!!!!!!!!!!!!!!");
		});
	}).register("another",function($) {
		$(this).on("click",function(evt) {
			console.log(this);
		});
	});