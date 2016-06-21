define(function() {
	function $readyStateHandler(success,failure) {
		try {
			switch(xhr.readyState) {
				case 0:
					console.log("Readystate: " + xhr.readyState + "Request has not been opened yet");
					break;
				case 1:
					console.log("Readystate: " + xhr.readyState + "Request has been opened,headers can now be set before calling the send() method.");
					break;
				case 2:
					console.log("Readystate: " + xhr.readyState + "Request has been sent and response headers have been received.");
					break;
				case 3:
					console.log("Readystate: " + xhr.readyState + "Response is being formulated.");
					break;
				case 4:
					console.log("Readystate: " + xhr.readyState + "Response has been recieved.Check to see if it was a successful request or if the server returned an error.");
					if(xhr.status === 200) {
						success(xhr);
					} else {
						failure(xhr);
					}
					break;
				default:
					console.log("Readystate: " + xhr.readyState + "Something has gone wrong with the request.");
					break;
			}		
		} catch(e) {
			console.log("Caught an exception: " + e.description);
		}

	}
	
	function checkParams(args) {
		//args is the arguments array from the request method in the Ajax object.
		
		if(Object.prototype.isPrototypeOf(args[0])) {
			//user passed an object of options rather than a series of parameters
			
			var options = args[0];
			
			//check for and validate url and method options
			if(options.url && options.method) {
				if(typeof options.url && options.method !== "string") {
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
						return [true];
						break;
				}
			}
			return [true,"object"];
		} else {
			//user passed each parameter individually
			//check for and validate url and method options
			if(args[0] && args[1]) {
				if(typeof args[0] && args[1] !== "string") {
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
							return;
						}
						break;
					case "failure":
						if(typeof option !== "function" || null) {
							console.log("falure handler needs to be a function.");
							return;
						}
						return [false];
						break;
					case "dataFilter":
						if(typeof option !== "function" || null) {
							console.log("dataFilter calllback must be a function.");
							return [false];
						}
						return [false];
						break;
					case "beforeSend":
						if(typeof option !== "function" || null) {
							console.log("beforeSend callback must be a function.");
						}
						return [false];
						break;
					case "afterSend":
						if(typeof option !== "function" || null) {
							console.log("afterSend callback must be a function.");
						}
						return [false];
						break;
					case "complete":
						if(typeof option !== "function" || null) {
							console.log("onComplete callback must be a function");
						}
						return [false];
						break;
					default:
						//do nothing
						break;
				}	
			}
			return [true,"array"];
		}
	}
	
	
	
	var Ajax = {
		request: function(url,method,data,success,failure,beforeSend,afterSend,complete) {
			var xhr;
			
			//make request here.
			if(xhr = new XMLHttpRequest()) {
				//If xhr object is created successfully:
				
				//validate parameters and verify if they were passed in as an object or one by one.
				var validation = checkParams(arguments);
				//check if validation succeeded,end everything if it did not
				if(validation[0] === false) {
					return;
				}
				
				//if parameters were passed in as an object
				if(validation[1] === "object") {
					//use options only if checkParams() returns "object": 
					//it is meant to rename the first parameter to a more meaningful name if the user passed an object of parameters.
					var options = url;	
					
					xhr.onreadystatechange = $readyStateHandler;
					xhr.open(options.method.toUpperCase(),options.url);
					if(options.data) {
						if(options.dataFilter) {
							options.dataFilter(options.data);
						} else {
							JSON.stringify(options.data);
						}
					
						options.beforeSend(xhr);
						xhr.send(options.data);
						options.afterSend(xhr);
					} else {
						options.beforeSend(xhr);
						xhr.send();
						options.afterSend(xhr);
					}
				} 
				//if parameters were passed in one by one
				else {
					xhr.onreadystatechange = readyStateHandler;
					xhr.open(options.method.toUppercase(),options.url);
					if(options.data) {
						if(dataFilter) {
							dataFilter(data);
						} else {
							JSON.stringify(data);
						}
						
						beforeSend(xhr);
						xhr.send(data);
						afterSend(xhr);
					} else {
						options.beforeSend(xhr);
						xhr.send();
						afterSend(xhr);
					}
				}
			} else {
				console.log("Could not create an XHR object.");
			}
		}	
	};
	return Ajax;
});