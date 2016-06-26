"use strict";
(function() {
	var $root;
	var $name;
	
	function $convertName(name) {
		var mutableName = "";
		for(var i = 0;i < name.length;i++) {
		
			if(name[i] === "-") {
				//do nothing
			} else {
				if(name[i - 1] === "-") {
					mutableName = mutableName + name[i].toUpperCase();
				} else {
					mutableName = mutableName + name[i];
				}
			}
			
		}		
	}
	
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