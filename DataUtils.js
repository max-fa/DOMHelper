(function() {
	"use strict";

	/*
		START: POLYFILLS
		Credits: MDN Link: mdn.mozilla.org
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
		
		
		
		if (!String.prototype.includes) {
		  String.prototype.includes = function(search, start) {
			'use strict';
			if (typeof start !== 'number') {
			  start = 0;
			}
			
			if (start + search.length > this.length) {
			  return false;
			} else {
			  return this.indexOf(search, start) !== -1;
			}
		  };
		}
		
		
		
		// Production steps of ECMA-262, Edition 6, 22.1.2.1
		// Reference: https://people.mozilla.org/~jorendorff/es6-draft.html#sec-array.from
		if (!Array.from) {
		  Array.from = (function () {
			var toStr = Object.prototype.toString;
			var isCallable = function (fn) {
			  return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
			};
			var toInteger = function (value) {
			  var number = Number(value);
			  if (isNaN(number)) { return 0; }
			  if (number === 0 || !isFinite(number)) { return number; }
			  return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
			};
			var maxSafeInteger = Math.pow(2, 53) - 1;
			var toLength = function (value) {
			  var len = toInteger(value);
			  return Math.min(Math.max(len, 0), maxSafeInteger);
			};

			// The length property of the from method is 1.
			return function from(arrayLike/*, mapFn, thisArg */) {
			  // 1. Let C be the this value.
			  var C = this;

			  // 2. Let items be ToObject(arrayLike).
			  var items = Object(arrayLike);

			  // 3. ReturnIfAbrupt(items).
			  if (arrayLike == null) {
				throw new TypeError("Array.from requires an array-like object - not null or undefined");
			  }

			  // 4. If mapfn is undefined, then let mapping be false.
			  var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
			  var T;
			  if (typeof mapFn !== 'undefined') {
				// 5. else
				// 5. a If IsCallable(mapfn) is false, throw a TypeError exception.
				if (!isCallable(mapFn)) {
				  throw new TypeError('Array.from: when provided, the second argument must be a function');
				}

				// 5. b. If thisArg was supplied, let T be thisArg; else let T be undefined.
				if (arguments.length > 2) {
				  T = arguments[2];
				}
			  }

			  // 10. Let lenValue be Get(items, "length").
			  // 11. Let len be ToLength(lenValue).
			  var len = toLength(items.length);

			  // 13. If IsConstructor(C) is true, then
			  // 13. a. Let A be the result of calling the [[Construct]] internal method of C with an argument list containing the single item len.
			  // 14. a. Else, Let A be ArrayCreate(len).
			  var A = isCallable(C) ? Object(new C(len)) : new Array(len);

			  // 16. Let k be 0.
			  var k = 0;
			  // 17. Repeat, while k < len… (also steps a - h)
			  var kValue;
			  while (k < len) {
				kValue = items[k];
				if (mapFn) {
				  A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
				} else {
				  A[k] = kValue;
				}
				k += 1;
			  }
			  // 18. Let putStatus be Put(A, "length", len, true).
			  A.length = len;
			  // 20. Return A.
			  return A;
			};
		  }());
		}		
	
	})();
	
	/*
		END: POLYFILLS
	*/
	
	
	
	

	var $computedPropertyCache = new WeakMap();
	
	
	
	
	
	/*
		START SECTION: Data Basics
	*/
	
	function $typeOf(obj) {
	
		if( typeof obj === "string" ) {
		
			return "string";
		
		} else if( typeof obj === "number" ) {
		
			return "number";
		
		} else if( typeof obj === "function" ) {
		
			return "function";
		
		} else if( Array.isArray(obj)  ) {
		
			return "array";
		
		} else if( obj.isPrototypeOf ) {
		
			return "object";
		
		} else if( typeof obj === "undefined" ) {
		
			return "undefined";
		
		} else if( obj === "null" ) {
		
			return "null";
		
		} else if( obj === true || obj === false ) {
		
			return "boolean";
		
		}
	
	}
	
	/*
		END SECTION: Data Basics
	*/
	
	
	
	

	/*
		START SECTION: Computed Properties
	*/
	
	//transform a deep dependency string into an array for each object path level
	function $transformDep(depString) {

		var depPath = depString.toString();
		var i = 0;
		var character;
		var startPoint = 0;
		var transformedDep = [];
		
		while( i < depPath.length ) {
			
			character = depPath[i];
			if( character === "." ) {
				
				transformedDep.push(depPath.slice(startPoint,i));
				startPoint = i + 1;
			
			}
			
			if( i === depPath.length - 1 ) {
			
				transformedDep.push(depPath.slice(startPoint));
			
			}
			
			
			
			i++;
		
		}
		
		return transformedDep;

	}
	
	
	
	//return a more easily processed version of the dependencies array
	function $parseDependencies(depsArray) {
		
		var parsedDeps = [];
		
		//map through all the elements in depsArray
		depsArray.forEach(function(dep,index,depsArray) {
		
			//if any of the elements in depsArray have a dot in them treat them as object paths
			//and call the $transformDep() function to divide each property into a nested array
			if( dep.includes(".") ) {
				
				//process string to create multi-dimensional array to represent nested object properties
				parsedDeps.push($transformDep(dep));
			
			} else {
			
				parsedDeps.push(dep);
			
			}
		
		});
		
		return parsedDeps;
	
	}
	
	
	
	function $depsChanged(computedProp) {

		var depValues = [];
		var obj = data;
		
		//iterate through all the property strings
		computedProp.deps.forEach(function(dep,index,depsArray) {
			
			//check if any of the dep strings is an array
			if( Array.isArray(dep) ) {
				
				//iterate through each element in array to recreate object path
				dep.forEach(function(nestedProp,index,objectPath) {
					
					obj = obj[nestedProp];
				
				});
				
				depValues.push(obj);
				obj = data;
			
			} else {
			
				//just use the string as a first-level property name on the data object
				depValues.push(data[dep]);
			
			}
		
		});

	}
	
	
	
	function $shouldCompute(registrarKey,computedPropName) {
		
		
		//go to the key in $computedRegistrar and search through its computed property records and find the record that has the same
		//name as the computedPropName parameter
		var computedProp = $computedRegistrar.get(registrarKey).find(function(computedPropRecord,index,computedPropsArray) {
		
			return computedPropRecord.name === computedPropName;
		
		});
		
		/*
			If the computed property doesn't have a result previously cached,return true.
			If the computed property does have a cachedResult(other than null),check if it's dependencies have changed
			if the dependencies have changed,return true,otherwise,false.
		*/
		if( computedProp.cachedResult === null || $depsChanged(computedProp) === true ) {
		
			return true;
		
		} else {
			
			return false;
		
		}

	}
	
	
	
	//'this' is set,using .call(), by $generateComputed to be the object on which the computed property is defined
	function $cacheResult(result,computedPropName) {
	
		var computedProp = $computedRegistrar.get(this).find(function(computedPropRecord,index,computedPropsArray) {
		
			return computedPropRecord.name === computedPropName;
		
		});
		
		computedProp.cachedResult = result;
		
	
	}
	
	
	
	/*

		Defines a getter-only property on the specified calling object
		the getter is our own function which first checks if any of the dependencies have changed.
		If any of the dependencies have changed(or if this is the first time the computed property has been accessed) then call fn.
		If no dependencies have changed and there is a cached result of fn,deliver the cached result

	*/
	function $generateComputed(deps,name,fn) {
		
		//define the computed property
		Object.defineProperty(this,name,{
	
		configurable: true,
		
		enumerable: true,
		
		writable: false,
		
		get: function() {
		
			//store a boolean telling whether to pull a result from the $computedRegistrar,or call fn again
			var reCompute = $shouldCompute(this,name);
			
			if( reCompute ) {
			
				$cacheResult.call(this,fn.bind(this)(),name);
			
			} else {
			
				return $getFromCache(this,name);
			
			}
			
		},
		
		set: function(val) {
		
			console.log("Cannot set a computed property,you can only access or delete them.");
			return false;
		
		}
		
		});
		
		
		
		//logic for registering the computed property
		if( $computedRegistrar.has(this) ) {
		
			//if this object is recorded in the computed properties cache,add a new record for this new computed property
			var computedRecords = $computedRegistrar.get(this);
			computedRecords.push( { name: name, deps: $parseDependencies(deps), depsCache:null cachedResult: null } );
		
		} else {
		
			//if this object doesn't have any computed properties in the computed properties registrar,add this object as a key in the $computedRegistrar weakmap
			//and push an object corresponding to this computed property into the registrar under this object's key
			$computedRegistrar.set(this,[
				{ name: name, deps: $parseDependencies(deps), depsCache: null, cachedResult: null }
			]);
		
		}
	
	}
	
	/*
		END SECTION: Computed Properties
	*/
	
	
	
	/*
		START SECTION: Exposing API
	*/
	
	var DataUtils = {
		
		computed: $generateComputed
	};
	
	
	
	if( window.DOMHelper ) {
	
		DOMHelper.DataUtils = DataUtils;
	
	} else {
	
		window.DOMHelper = {
			DataUtils: DataUtils
		};
	
	}

})();