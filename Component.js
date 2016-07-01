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
		window.DOMHelper.data = {};
	} else {
		window.DOMHelper = {
			Component: Component,
			data: {}
		};
	}
	window.DOMHelper.DOMUtils ? Component.$ = DOMHelper.DOMUtils.get : console.log("Download the DOMUtils module to have access to a specialized copy of jQuery in the DOMHelper.Component.$ namespace or make sure that you included the DOMUtils module before the Component module so it is visible to it.");
})();