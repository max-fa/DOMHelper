"use strict";
window.onload = function() {
	//alert("Loadedd!");
	//alert("Loadedd!");
	var Ajax = window.DOMHelper.Ajax;
	document.getElementById("button").onclick = function() {
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
		
		var form = DOMHelper.Component.create("testForm");
		console.log(form.getRoot());
	}
};