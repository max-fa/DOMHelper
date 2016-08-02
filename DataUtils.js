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
		
		if( obj === null ) {
		
			return "null";
		
		} else if( typeof obj === "undefined" ) {
		
			return "undefined";
		
		} else if( typeof obj === "number" ) {
		
			return "number";
		
		}
		
		if( typeof obj === "string" ) {
		
			return "string";
		
		} else if( typeof obj === "function" ) {
		
			return "function";
		
		} else if( Array.isArray(obj)  ) {
		
			return "array";
		
		} else if( obj === true || obj === false ) {
		
			return "boolean";
		
		} else if( obj.isPrototypeOf ) {
		
			return "object";
		
		}

	}
	
	/*
		END SECTION: Data Basics
	*/
	
	
	
	

	/*
		START SECTION: Computed Properties
	*/
	
	function $findComputed(searchParams) {

		return $computedRegistry.get(searchParams.key).find(function(computedProp,index,computedRegistrar) {
		
			return computedProp.name === searchParams.propName;
		
		});

	}


	//transform a deep dependency string into an array for each object property level
	function $transformObjPath(depString) {

		//call .toString() to get raw string from possible String object which may contain enumerable properties
		//that will interfere with iterating through the string. .toString() is synonymous with .toValue() in the context of string objects
		var depPath = depString.toString();
		var i = 0;
		var character;
		var startPoint = 0;
		var transformedDep = [];
		
		while( i < depPath.length ) {
			
			character = depPath[i];
			if( character === "." ) {
				
				//if we reach a dot in the string,slice all the characters up to this point
				//and push them into [ transformedDep ] and set startPoint to be just after the dot
				transformedDep.push(depPath.slice(startPoint,i));
				startPoint = i + 1;
			
			}
			
			if( i === depPath.length - 1 ) {
				
				//once we reach the end of the string,slice from the previous dot up to the end
				//and push it into [ transformedDep ]
				transformedDep.push(depPath.slice(startPoint));
			
			}
			
			
			
			i++;
		
		}
		
		return transformedDep;

	}



	//loop through the array of dependency strings and proccess any of them that are deep object paths using $transformObjPath()
	function $parseDependencies(depsArray) {
		
		var parsedDeps = [];
		
		//map through all the elements in depsArray
		depsArray.forEach(function(dep,index,depsArray) {
		
			//if any of the elements in depsArray have a dot in them treat them as object paths
			//and call the $transformObjPath() function to divide each property into a nested array
			if( dep.includes(".") ) {
				
				//process string to create array where each element represents a property on the data object
				parsedDeps.push($transformObjPath(dep));
			
			} else {
				
				parsedDeps.push(dep);
			
			}
		
		});
		
		return parsedDeps;

	}



	//query any properties specified by deep object paths in dependency strings
	function $extractValues(dependencies,DATAOBJECT) {

		var values = [];
		var obj = DATAOBJECT;


		//iterate through all the property strings
		dependencies.forEach(function(dep,index,depsArray) {
			
			//check if any of the dep strings is an array
			if( $typeOf(dep) === "array" ) {
				
				//if any of the dependency strings are arrays iterate through them.
				//Each element is a string and will be a property leading us to the dependency deeper whithin the object
				dep.forEach(function(nestedProp,index,objectPath) {
					
					//set obj to be an object one level deeper as we traverse down the object path to the dependency
					obj = obj[nestedProp];
				
				});
				
				values.push(obj);
				obj = DATAOBJECT;
			
			} else {
			
				//just use the string as a top-level property name on the data object
				values.push(obj[dep]);
			
			}
		
		});	

		return values;

	}



	function $depsChanged(computedProp,DATAOBJECT) {
		
		//current values of listed dependencies
		var currentValues = $extractValues(computedProp.deps,DATAOBJECT);
		//values of listed dependencies from last time computed property was accessed
		var cachedValues = computedProp.cachedDeps;
		var i = 0;
		//first check if both arrays of dependencies have the same number of elements
		if( currentValues.length === cachedValues.length ) {
			
			//loop through the arrays and compare each value
			//if there are any values that don't match,return true
			while( i < currentValues.length ) {
			
				if( currentValues[i] !== cachedValues[i] ) {
				
					return true;
				
				}
				i++;
			
			}
			
			return false;
		
		} else {
		
			console.log("current dependencies and cached dependencies are different based on length");
			return true;
		
		}

	}



	function $shouldCompute(searchParams,DATAOBJECT) {
		
		//get the computed property currently invoked
		var computedProp = $findComputed(searchParams);

		//if there are no dependencies to keep track of
		if( computedProp.deps === null ) {
			
			//if this computed property has not been accessed yet,return true,otherwise: false.
			if( !computedProp.called ) {
			
				return true;
			
			} else {
			
				return false;
			
			}
		
		} 
		//if there are dependencies to keep track of
		else {
			
			//if the computed property has not been accessed yet or the dependencies
			//have changed since the last call,return true.
			
			if( computedProp.called === false )   {
				
				return true;
			
			} else if( $depsChanged(computedProp,DATAOBJECT) === true ) {
				
				return true;
			
			} else {
				
				return false;
			
			}
		
		}

	}



	function $getCachedResult(searchParams) {

		return $findComputed(searchParams).cachedResult;

	}



	//'this' is set,using .call(), by $generateComputed to be the object on which the computed property is defined
	function $cacheResult(searchParams,result,deps) {

		var computedProp = $findComputed(searchParams);
		
		computedProp.cachedResult = result;
		computedProp.cachedDeps = deps;
		computedProp.called = true;
		

	}



	/*

		Defines a getter-only property on the calling object
		the getter is our own function which first checks if any of the dependencies have changed.
		If any of the dependencies have changed(or if this is the first time the computed property has been accessed) then call fn.
		If no dependencies have changed and there is a cached result of fn,deliver the cached result

	*/
	function $generateComputed(deps,name,fn,DATAOBJECT) {
		
		var searchParams = {
			key: this,
			propName: name
		};

		//define the computed property
		Object.defineProperty(this,name,{

		configurable: true,
		
		enumerable: true,
		
		get: function() {
			
			//store a boolean telling whether to pull a result from the $computedRegistry,or call fn again
			var compute = $shouldCompute(searchParams,DATAOBJECT);

			if( compute === true ) {
				
				var computeResult = fn.bind(this)();
				$cacheResult( searchParams, computeResult, $extractValues( $parseDependencies(deps),DATAOBJECT ) );
				return computeResult;

			} else {
			
				console.log("Returning cached result");
				return $getCachedResult(searchParams);
			
			}
			
		},
		
		set: function(val) {
		
			console.log("Cannot set a computed property,you can only access or delete them.");
			return false;
		
		}
		
		});
		
		
		
		//logic for registering the computed property
		if( $computedRegistry.has(this) ) {
		
			//if this object is recorded in the computed properties cache,add a new record for this new computed property
			var computedRecords = $computedRegistry.get(this);
			computedRecords.push( { name: name, deps: $parseDependencies(deps), cachedDeps: $extractValues( $parseDependencies(deps),DATAOBJECT ), cachedResult: null,called: false } );
		
		} else {
		
			//if this object doesn't have any computed properties in the computed properties registry,add this object as a key in the $computedRegistry weakmap
			//and push an object corresponding to this computed property into the registry under this object's key
			$computedRegistry.set(this,[
				{ name: name, deps: $parseDependencies(deps), cachedDeps: $extractValues( $parseDependencies(deps),DATAOBJECT ), cachedResult: null,called: false }
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
	
		genComputed: function(host,deps,name,fn,DATAOBJECT) {
		
			$generateComputed.call(host,deps,name,fn,DATAOBJECT);
		
		},
		
		typeOf: $typeOf,
		
		DataObject: {
		
			
		
		}
		
	};
	
	
	
	if( window.DOMHelper ) {
	
		DOMHelper.DataUtils = DataUtils;
	
	} else {
	
		window.DOMHelper = {
			DataUtils: DataUtils
		};
	
	}

})();