(function() {

	/*
		START: POLYFILLS
	*/
	(function() {
	
		if (!Array.prototype.find) {
		  Array.prototype.find = function(predicate) {
			if (this == null) {
			  throw new TypeError('Array.prototype.find called on null or undefined');
			}
			if (typeof predicate !== 'function') {
			  throw new TypeError('predicate must be a function');
			}
			var list = Object(this);
			var length = list.length >>> 0;
			var thisArg = arguments[1];
			var value;

			for (var i = 0; i < length; i++) {
			  value = list[i];
			  if (predicate.call(thisArg, value, i, list)) {
				return value;
			  }
			}
			return undefined;
		  };
		}
	
	})();
	/*
		END: POLYFILLS
	*/
	
	
	
	

	var $computedPropertyCache = new WeakMap();
	
	
	
	
	
	/*
		START SECTION: Data Basics
	*/
	
	function $typeOf() {
	
		if( typeof this === "string" ) {
		
			return "string";
		
		} else if( typeof this === "number" ) {
		
			return "number";
		
		} else if( typeof this === "function" ) {
		
			return "function";
		
		} else if( Array.isArray(this)  ) {
		
			return "array";
		
		} else if( this.isPrototypeOf ) {
		
			return "plainobject";
		
		} else if( typeof this === "undefined" ) {
		
			return "undefined";
		
		} else if( this === "null" ) {
		
			return "null";
		
		} else if( this === true || this === false ) {
		
			return "boolean";
		
		}
	
	}
	
	/*
		END SECTION: Data Basics
	*/


	
	
	
	/*
		START SECTION: Observables
	*/

	function $makeObservable(observeThis) {
	
		//find the type of what's trying to be observed
		var type = $typeOf.bind(observeThis)();
		
		//depending on the type,do something
		switch( type ) {
		
			case "plainobject":
				$observePlainObject(obj);
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
				
			case "function":
				console.log("Will fire a function when you attempt to observe it,so you're basically observing it's return value.");
				$observeFunction(obj);
				break;
				
			case "undefined":
				console.log("Cannot observe undefined.");
				return false;
				break;
				
			case "null":
				console.log("Cannot observe null");
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

	/*
		Checks if the array of dependencies is composed of observable values
	*/
	
	function $depsObservable(deps) {
	
		var i = 0;
		
		while( i < deps.length ) {
			
			if( !$isObservable(deps[i]) ) {
			
				console.log("Can only declare an observable object as a dependency.Look up documentation on making objects observable in DataUtils.js.");
				return false;
			
			}
			
			i++;
		
		}
		
		return true;
	
	}
	
	
	
	
	function $depsMissing(deps) {
	
		var i = 0;
		
		while( i < deps.length ) {
		
			if( deps[i] === null || deps[i] === undefined ) {
			
				console.log("Cannot compute value: blank dependency");
				return false;
			
			}
			
			if( diff(deps[i]) ) {
			
				
			
			}
		
		}
	
	}
	
	
	
	/*

		Defines a getter-only property on the specified calling object
		the getter is our own function which first checks if any of the dependencies are missing (null or undefined),or if they have changed.
		In the case of missing dependencies,the user-passed function (the 'computed' in 'computed property') will not be called and a warning will be issued instead,
		If none of the dependencies have changed,then just deliver a cached return value of fn or call fn if any dependencies have changed from when it was last called.

	*/	
	
	function $checkCache(obj,computedPropName) {
	
		var i = 0;
		
		
		//find the key in the $computedCache weakmap that contains the computed property info object and store the info object
		var computedProp = $computedCache.get(obj).filter(function(el,index,computedPropsArray) {
		
			if( el.name === computedPropName ) {
			
				return true;
			
			} else {
			
				return false;
			
			}
		
		});
		
		/*
			If the computedProperty doesn't have a result previously cached,return true.
			If the computeProperty does have a cachedResult(other than null),check if it's dependencies have changed
			if the dependencies have changed,return true,otherwise,false.
		*/
		if( computedProp.cachedResult === null ) {
		
			return true;
		
		} else {
			
			
		
		}
	
	}
	
	
	
	function $generateComputed(deps,name,fn) {
		
		//if a property exists on the calling object that already has a name equal to the name argument
		if( this[name] ) {
		
			console.log( "Cannot use '" + name + "': name already taken." );
		
		} else {
			
			/*
				now,actually create a computed property on this object while registering it internally
			*/
			
			//define the computed property
			Object.defineProperty(this,name,{
		
			configurable: true,
			
			enumerable: true,
			
			writable: false,
			
			get: function() {
			
				reCompute = $checkCache(this,name);
				
				if( reCompute ) {
				
					fn.bind(this)();
				
				} else {
				
					return $getFromCache(this,name);
				
				}
				
			},
			
			set: function(val) {
			
				console.log("Cannot set a computed property,you can only access or delete them.");
				return false;
			
			}
			
			});
			
			
			
			//logic for caching the computed property
			if( $computedCache.has(this) ) {
			
				//if this object is recorded in the computed properties cache,add a new record for this new computed proerty
				var computedRecord = $computedCache.get(this);
				computedRecord.push({ name:name,deps:deps,cachedResult:null });
			
			} else {
			
				//if this object isn't recorded in the computed properties cache,add this object as a key in the $computedCache weakmap
				//and push an object corresponding to this computed property into the cache
				$computedCache.set(this,[
					{ name: name,deps:deps,cachedResult: null }
				]);
			
			}
		
		}
	
	}
	
	/*
		END SECTION: Computed Properties
	*/
	
	
	
	/*
		START SECTION: Exposing API
	*/
	
	var DataUtils = {
		
		computed: $generateComputed,
		
		//collection: $generateCollection
	};
	
	
	
	if( window.DOMHelper ) {
	
		DOMHelper.DataUtils = DataUtils;
	
	} else {
	
		window.DOMHelper = {
			DataUtils: DataUtils
		};
	
	}

})();