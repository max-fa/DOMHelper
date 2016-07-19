(function() {

	/*
		START SECTION: Observables
	*/

	function $makeObservable(obj,type) {
	
		switch( type ) {
		
			case "object":
				$observeObject(obj);
				break;
				
			case "array":
				$observeArray(obj);
				break;
				
			case "string":
				$observeStringObject(obj);
				break;
				
			case "number":
				$observeNumberObject(obj);
				break;
				
			case "boolean":
				$observeBoolean(obj);
				break;
		
			default:
				//do nothing
				break;
		}
	
	}

	/*
		END SECTION: Observables
	*/
	
	
	
	

	/*
		START SECTION: Computed Properties
	*/

	function $checkDeps(deps) {
	
		var i = 0;
		
		while( i < deps.length ) {
		
			if( deps[i] === null || deps[i] === undefined ) {
			
				return false;
			
			} 
			
			if( !deps[i].isObservable() ) {
			
				console.log("Can only declare an observable object as a dependency.Look up documentation on wrapping objects in the DataUtils.Observable object.");
				return false;
			
			}
			
			i++;
		
		}
		
		return true;
	
	}
	
	
	
	/*

		Defines a getter-only property on the specified calling object
		the getter is our own function which first checks if any of the dependencies are missing (null or undefined),or if they have changed.
		In the case of missing dependencies,the user-passed function (the 'computed' in 'computed property') will not be called and a warning will be issued instead,
		If none of the dependencies have changed,then just deliver a cached return value of fn or call fn if any dependencies have changed from when it was last called.

	*/	
	
	function $generateComputed(deps,name,fn) {
	
		var validParams = $checkComputedParams(arguments);
		var reCompute;
		
		if( validParams ) {
		
			//if a property exists on the calling object that already has a name equal to the name argument
			if( this[name] ) {
			
				console.log( "Cannot use '" + name + "': name already taken." );
			
			} else {
			
				Object.defineProperty(this,name,{
				
					configurable: true,
					
					enumerable: true,
					
					writable: false,
					
					get: function() {
					
						var deps = $checkDeps(deps);
						
						if( deps === true ) {
						
							reCompute = $diff(this,name);
							
							if( reCompute ) {
							
								fn.bind(this);
							
							} else {
							
								return $getFromCache(this,name);
							
							}
						
						}
						
					},
					
					set: function(val) {
					
						console.log("Cannot set a computed property,you can only access or delete them.");
						return false;
					
					}
					
				});
			
			}
		
		} else {
		
			return false;
		
		}
	
	}
	
	/*
		END SECTION: Computed Properties
	*/
	
	
	
	/*
		START SECTION: Exposing API
	*/
	
	var DataStore = {
		create: function() {
		
			return Object.create(this);
		
		},
		
		computedCache: $cache,
		
		computed: $generateComputed
	};
	
	
	
	var DataUtils = {
		Store: DataStore
	};
	
	if( window.DOMHelper ) {
	
		DOMHelper.DataUtils = DataUtils;
	
	} else {
	
		window.DOMHelper = {
			DataUtils: DataUtils
		};
	
	}

})();