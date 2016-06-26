"use strict";
(function() {
	var $root;
	var $name;
	
	

	function $setRoot(name) {
		$root = document.querySelector('[data-component=' + name + ']');
	}
	
	
	
	var Component = {
		getRoot: function() {
			return $root;
		},
		
		data: {},
		
		create: function(name) {
			var component = Object.create(this);
			$setRoot(name);
			return component;
		}
	};
	
	
	
	if(window.DOMHelper) {
		window.DOMHelper.Component = Component;
	} else {
		window.DOMHelper = {
			Component: Component,
			data: {}
		};
	}
})();