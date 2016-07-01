"use strict";
(function() {
	function $readyStateHandler(success,failure,complete,xhr) {
		try {
			switch(xhr.readyState) {
				case 0:
					//request is pristine
					break;
				case 1:
					//request has been opened
					break;
				case 2:
					//response headers have been sent
					break;
				case 3:
					//response in progress
					break;
				case 4:
					//response has been received
					if(complete) {complete(xhr)}
					if(xhr.status === 200) {
						//if success callback was provided
						if(success !== null || undefined) {
							console.log("Success: response returned with a status code of " + xhr.status);
							success(xhr);
						} 
						//if success callback was not provided
						else {
							console.log("Success: response returned with a status code of " + xhr.status);
							console.log(xhr);
						}
					} else {
						//if failure callback was provided
						if(failure !== null || undefined) {
							console.log("Failure: response returned with a status code of " + xhr.status);
							failure(xhr);
						} 
						//if failure callback was not provided
						else {
							console.log("Failure: response returned with a status code of " + xhr.status);
							console.log(xhr);
						}
					}
					break;
				default:
					console.log("Readystate: " + xhr.readyState + "Something has gone wrong with the request.");
					break;
			}		
		} catch(e) {
			console.log(e);
		}

	}
	
	function $checkParams(args) {
		//args is the arguments array from the request method in the Ajax object.
		
		if( args[1] === undefined ) {
			//user passed an object of options rather than a series of parameters
			var options = args[0];
			
			//check for and validate url and method options
			if(options.url && options.method) {
				if( typeof options.url !== "string" || typeof options.method !== "string" ) {
					console.log("url and method options must be strings.");
					return [false];
				}
			} else {
				console.log("Must provide url and method options");
				return [false];
			}
		
			//loop through the rest of the options and validate them
			for(var option in options) {
				switch(option) {
					case "success":
						if(typeof options[option] !== "function") {
							console.log("success handler needs to be a function.");
							return [false];
						}
						break;
					case "failure":
						if(typeof options[option] !== "function") {
							console.log("falure handler needs to be a function.");
							return [false];
						}
						break;
					case "dataFilter":
						if(typeof options[0] !== "function" || null) {
							console.log("dataFilter calllback must be a function.");
							return [false];
						}
						return [false];
						break;
					case "beforeSend":
						if(typeof options[option] !== "function") {
							console.log("beforeSend callback must be a function.");
							return [false];
						}
						break;
					case "afterSend":
						if(typeof options[option] !== "function") {
							console.log("afterSend callback must be a function.");
							return [false];
						}
						break;
					case "complete":
						if(typeof options[option] !== "function") {
							console.log("onComplete callback must be a function");
							return [false];
						}
						break;
					default:
						return [true,"object"];
						break;
				}
			}
			return [true,"object"];
		} else {
			//user passed each parameter individually
			//check for and validate url and method options
			if(args[0] && args[1]) {
				if( typeof args[0] !== "string" || typeof args[1] !== "string" ) {
					console.log("url and method options must be strings.");
					return [false];
				}
			} else {
				console.log("Must provide url and method options");
				return [false];
			}
			
			//now validate all of the parameters.
			for(var i = 0;i < args.length;i++) {
				var option = args[i];
				switch(option) {
					case "success":
						if(typeof option !== "function" || null) {
							console.log("success handler needs to be a function.");
							return [false];
						}
						break;
					case "failure":
						if(typeof option !== "function" || null) {
							console.log("falure handler needs to be a function.");
							return [false];
						}
						break;
					case "dataFilter":
						if(typeof option !== "function" || null) {
							console.log("dataFilter calllback must be a function.");
							return [false];
						}
						break;
					case "beforeSend":
						if(typeof option !== "function" || null) {
							console.log("beforeSend callback must be a function.");
							return [false];
						}
						break;
					case "afterSend":
						if(typeof option !== "function" || null) {
							console.log("afterSend callback must be a function.");
							return [false];
						}
						break;
					case "complete":
						if(typeof option !== "function" || null) {
							console.log("onComplete callback must be a function");
							return [false];
						}
						break;
					default:
						[true,"array"];
						break;
				}	
			}
			return [true,"array"];
		}
	}
	
	
	
	//define ajax component
	var Ajax = {
		request: function(url,method,data,success,failure,dataFilter,beforeSend,afterSend,complete) {
			console.log(arguments);
			var xhr;
			//make request here.
			if(xhr = new XMLHttpRequest()) {
				//If xhr object is created successfully:
				
				//validate parameters and verify if they were passed in as an object or one by one.
				var validation = $checkParams(Array.prototype.slice.call(arguments));
				//check if validation succeeded,end everything if it did not
				if(validation[0] === false) {
					return;
				}
				
				//if parameters were passed in as an object
				if(validation[1] === "object") {
					//use options only if $checkParams() returns "object": 
					//it is meant to rename the first parameter to a more meaningful name if the user passed an object of parameters.
					var options = url;	
					
					xhr.onreadystatechange = function() {
						var callbacks = [options.success,options.failure,options.complete,xhr];
						$readyStateHandler.apply(window,callbacks);
					}
						
						/*//if user passed any lifecycle(success,failure,or complete) callbacks,pass them to $readyStateHandler
						//if not,just call readyStateHandler and let it default on them
						if(callbacks.length > 0) {
							$readyStateHandler.apply(window,callbacks)
						} else {
							$readyStateHandler();
						}*/
					//}
					xhr.open(options.method.toUpperCase(),options.url);
					if(options.data) {
						if(options.dataFilter) {
							options.data = options.dataFilter(options.data);
						} else {
							options.data = JSON.stringify(options.data);
						}
					
						if(options.beforeSend) {options.beforeSend(xhr);}
						xhr.send(options.data);
						if(options.afterSend) {options.afterSend(xhr);}
					} else {
						if(options.beforeSend) {options.beforeSend(xhr);}
						xhr.send();
						if(options.afterSend) {options.afterSend(xhr);}
					}
				} 
				//if parameters were passed in one by one
				else {
					xhr.onreadystatechange = function() {
						var callbacks = [success,failure,complete,xhr];
						$readyStateHandler.apply(window,callbacks);
					};
					xhr.open(method.toUpperCase(),url);
					if(data) {
						if(dataFilter) {
							data = dataFilter(data);
						} else {
							data = JSON.stringify(data);
						}
						
						if(beforeSend) {beforeSend(xhr);}
						xhr.send(data);
						if(afterSend) {afterSend(xhr);}
					} else {
						if(beforeSend) {beforeSend(xhr);}
						xhr.send();
						if(afterSend) {afterSend(xhr);}
					}
				}
			} else {
				console.log("Could not create an XHR object.");
			}
		}
	};
	window.DOMHelper ? DOMHelper.Ajax = Ajax : window.DOMHelper = {Ajax: Ajax};
})();