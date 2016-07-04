(function() {
	var $root;
	var $name;
	
	

	function $setRoot(name) {
		$root = document.querySelector('[data-component=' + name + ']');
	}
	
	
	var $directiveStore = [];
	
	var $directives = {
		$register: function(fn) {
			if( Function.prototype.isPrototypeOf(fn) ) {
			
				if( fn.name ) {
				
					if( $directiveStore.length > 0 ) {
						
						for( var i = 0; i < $directiveStore.length; i++ ) {
							var storedName = $directiveStore[i].name;
							console.log("loopy");
							if( storedName ) {
							
								console.log("so far");
								fn.name === storedName ? console.log("Cannot register directive: name already taken.") : $directiveStore.push(fn);
								
							} else {
							
								$directiveStore.push(fn);
								
							}
							console.log($directiveStore);
						}						
						
					} else {
						$directiveStore.push(fn);
					}

					
				} else {
					console.log("must use a named function");
					return false;
				}				
				
			} else {
			
				console.log("Directive must be a function.");
				return false;
				
			}
		},
		
	
		
		$run: function(name,el) {
		
			var fn;
			var i = 0;
			while( i < $directiveStore.length ) {
			
				fn = $directiveStore[i];
				fn.name === name ? ( fn( $(el) )) : i++;
				
			}
			
		}
	};
	
	
	
	var Component = {
		data: {},
		
		//expose the $register method
		directives: {
		
			register: $directives.$register
			
		},
		
		//create component and set it's name
		create: function(name) {
		
			var component = Object.create(this);
			$name = name;
			return component;

		},
	};
	
	
	if(window.DOMHelper) {
	
		window.DOMHelper.Component = Component;
		window.DOMHelper.data = {};
		
	} else {
	
		window.DOMHelper = {
			Component: Component,
			data: {},
			ready: false
		};
		
	}
	
	window.DOMHelper.DOMUtils ? Component.$ = DOMHelper.DOMUtils.get : console.log("Download the DOMUtils module to have access to a specialized copy of jQuery in the DOMHelper.Component.$ namespace or make sure that you included the DOMUtils module before the Component module so it is visible to it.");
	
	//apply user's code(bind components,execute directives) when DOM is ready
	document.addEventListener("DOMContentLoaded",function() {
		//use component's name to find element with matching component attribute and set element as the component's root node
		if( $name ) {
			$setRoot($name);
		}
		
		if( DOMHelper.DOMUtils ) {
			var $ = DOMHelper.DOMUtils.$;
			
			//find all elements under the root node and execute any directives
			$($root).find('*').each(function() {
				if( $(this).attr("directive") ) {
				
					var dirName = $(this).attr("directive");
					var i = 0;
					while(i < $directiveStore.length) {
						if( dirName === $directiveStore[i].name ) {
							$directiveStore[i].call(this,$);
							break;
						}
						i++;
					}
					
				}
			});
		}
	});
})();