(function() {	

	var $components = [];
	
	function $createComponent($name) {
		if( !$name ) {
		
			console.log("Must provide a name for your component.");
			return;
			
		} else {
		
			var component = Object.create(Component);
			component.data = {};
			var $root;
			var $directiveStore = [];
			
			
			/*
				START SECTION: DIRECTIVES
			*/
			
			
			function $checkForDirective(name) {
				//if there is already a directive stored,begin looping to check for name collisions
				if( $directiveStore.length > 0 ) {
				
					console.log("This should log for all directives after the first directive.");
					for( var i = 0; i < $directiveStore.length; i++ ) {
					
						var storedName = $directiveStore[i].name;
						console.log("We are in the loop");
						if( name === storedName ) {
						
							return true;
							
						} else {
							
							return false;
							
						}
						
					}
				//if there are no elements in $directiveStore,just return false
				} else {
					
					console.log("It's been going here the whole time");
					return false;
					
				}		
			}
			
			function $registerDirective(name,fn) {
				
				//check if directive is a function
				if( Function.prototype.isPrototypeOf(fn) ) {
					console.log(fn);
					
					//check if the directive has a name
					if( name ) {
					
						console.log("It's got a name");
						//boolean representing if a directive name has already been taken.
						var nameTaken = $checkForDirective(name);
						
						if(!nameTaken) {
							
							$directiveStore.push( {exe: fn,name: name});
							return this;
							
						} else {
						
							console.log("Cannot register directive: name already taken.");
							return false;
							
						}
						
					} else {
					
						console.log("must use a named function");
						return false;
						
					}				
					
				} else {
				
					console.log("Directive must be a function.");
					return false;
					
				}
			}
			

			
			function $runDirective(directive,el) {
				
				var $;
				if( DOMHelper.DOMUtils.$ ) {
				
					$ = DOMHelper.DOMUtils.$
					
				}
				
				
				directive.exe.call(el,$);
				
			}
			
			component.directives = {
				register: $registerDirective,
				
				getAll: function() {
					return $directiveStore;
				}
			};
			
			/*
				END SECTION: DIRECTIVES
			*/
			
			
			/*
				START SECTION: BOOTSTRAP
			*/
			
			//apply user's code(bind components,execute directives) when DOM is ready
			document.addEventListener("DOMContentLoaded",function() {
				var $;
				$root = document.querySelector('[data-component=' + $name + ']');
				if( DOMHelper.DOMUtils.$ ) {
				
					$ = DOMHelper.DOMUtils.$;
					
					//find all elements under the root node and execute any directives
					$($root).find('*').each(function(index,element) {
						var dirName;
						var i;
						if( $(element).attr("directive") ) {
						
							dirName = $(this).attr("directive");
							i = 0;
							while(i < $directiveStore.length) {
								if( dirName === $directiveStore[i].name ) {
									$runDirective($directiveStore[i],this);
									break;
									
								}
								i++;
							}
							
						}
					});
					
				}
			});
			
			/*
				END SECTION: BOOTSTRAP
			*/			
			
			$components.push(component);
			return component;
		}		
	}

	var Component = {
		data: {},
		
		create: $createComponent
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
	

		
})();