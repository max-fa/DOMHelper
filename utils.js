(function() {
	
	//The API that is returned to the library caller.
	var DOMHelper = {
		findElement: function(selector) {
			//elem will be set to the element(or elements)that are returned by this method.
			var elem;
			var selectorString = "";
			
			//For CSS selector: ID
			if(selector[0] === '#') {
				//selectorString will be set to the value we'll pass into document.getElement(s)By(Id) or (className).
				//var selectorString = "";
				//Filter out the symbol at the beginnning of the entered string ie. '#' or '.'.
				for(var i = 0;i < selector.length;i++) {
					if(selector[i] !== '#') {
						selectorString = selectorString + selector[i];
					}
				}
				elem = document.getElementById(selectorString);
				
			}
			//For CSS selector: CLASS
			else if(selector[0] === '.') {
				//selectorString will be set to the value we'll pass into document.getElement(s)By(Id) or (className).
				//var selectorString = "";
				//Filter out the symbol at the beginnning of the entered string ie. '#' or '.'.
				for(var i = 0;i < selector.length;i++) {
					if(selector[i] !== '.') {
						selectorString = selectorString + selector[i];
					}
				}
				elem = document.getElementsByClassName(selectorString);
				for(var i = 0;i < elem.length;i++) {
					createLibObj(elem[i]);
				}
				
			}
			
			//Adds the whole range of methods that assist in DOM manipulation to the object before we return it.
			return createLibObj(elem);
		}
	};
	
	
	
	
	
	////////////////////////////////////////////////////////////////////////////////
	
	//UTILITIES BELOW
	
	////////////////////////////////////////////////////////////////////////////////
	
	
	
	
	//OBJECT CONTAINING A COLLECTION OF UTILITY FUNCTION FOR USE INSIDE THIS LIBRARY AND EXPOSED TO THE USER.
	
	var Utilities = {
		getSetStyle: function (selectorText,property) {
			var ruleList;
			var stylesheets = document.styleSheets;
			var matches = 0;
			
			//Loop through all the page's internal and external stylesheets.
			for(var i = 0;i < stylesheets.length;i++) {
				//Store the current stylesheet's collection of css rules.
				ruleList = stylesheets[i].cssRules;
				//Loop through the list of rules the stylesheet contains.
				for(var j = 0;j < ruleList.length;j++) {
					//Check if any of the rules' selectorText property matches the selector passed into this function.
					if(ruleList[j].selectorText === selectorText) {
						var ruleStyles = ruleList[j].style;
						//we can match the parameter 'property' with any actual properties in this rule,return it.
						if(ruleStyles.getPropertyValue(property)) {
							matches++;
							console.log("Match found: " + ruleStyles.getPropertyValue(property));
							return ruleStyles.getPropertyValue(property);
						}
					}
				}
			}
			if(matches === 0) {
				console.log("No matches found for property '" + property + "' in '" + selectorText + "' in this page's stylesheets.");
			}
		},
		
		getComputedStyle: function(elem,property) {
			return window.getComputedStyle(elem).getPropertyValue(property);
		}
	};
	
	
	
	
	///////////////////////////////////////////////////////////////////////////
	
	//QUEUE BELOW.
	
	///////////////////////////////////////////////////////////////////////////
	
	
	
	
	
	//AN OBJECT CONTAINING AN ARRAY AND ASSOCIATED COLLECTION OF UTILITY FUNCITONS TO BE USED AS A QUEUE FOR ALL ANIMATION FUNCTIONS
	
	//The queue object which contains the queue and all related members.
	function Queue() {
		this.container = [];
		this.enabled = true;
	}
	
	Queue.prototype.enqueue = function(func,args,context) {
		this.container.push(function() {
			func.apply(context,args);
			//console.log("hello world");
		});
		if(this.container.length === 1) {
			this.container[0]();
		}
	};
	
	Queue.prototype.disableQueue = function() {
		this.container = null;
		this.enabled = false;
	};
	
	Queue.prototype.enableQueue = function() {
		this.container = [];
		this.enabled = true;
	};
	
	Queue.prototype.isEmpty = function() {
		if(this.container.length === 0) {
			return true;
		}
		else {
			return false;
		}
	};
	
	Queue.prototype.advanceQueue = function() {
		if(this.enabled === true) {
			if(this.container.length > 1) {
				this.container.shift();
				this.container[0]();			
			}
			else {
				this.container.shift();
			}
		}
		else {
			return;
		}
		
	}
	
	
	
	//////////////////////////////////////////////////////////////////////
	
	//FX BELOW.
	
	//////////////////////////////////////////////////////////////////////
	
	
	
	
	
	
	
	
	//The object that handles animations
	var FX = {
		animateRight: function(operation,limit,speed,callback) {
				var computedRight = window.getComputedStyle(this.dom).getPropertyValue('right');
				var elem = this.dom;
				var self = this;
				var parsedRight = parseInt(computedRight);
				var counter = 0;
				var interval;
				var delay;//how many milliseconds to delay each increment in elem's right property
				var rate;//by how many pixels elem's right property will be incremented by at a time
				if(speed === "fast") {
					delay = 5;
					rate = 5;
				}
				else if(speed === "slow") {
					delay = 10;
					rate = 1;
				}
				
				//MOVE STUFF BELOW
				
				if(operation === "inc") {
					interval = setInterval(function() {
						if(counter < limit) {
							parsedRight += rate;
							elem.style.right = parsedRight + "px";
							counter += rate;
						}
						else if(counter === limit) {
							clearInterval(interval);							
							if(callback) {
								callback();
							}
							self.queue.advanceQueue();
						}
						else if(counter > limit) {
							var difference = counter - limit;
							parsedRight -= difference;
							elem.style.right = parsedRight + "px";
							clearInterval(interval);
							if(callback) {
								callback();
							}
							self.queue.advanceQueue();
						}
					},delay);
				}
				else if(operation === "dec") {
					interval = setInterval(function() {
						if(counter < limit) {
							parsedRight -= rate;
							elem.style.right = parsedRight + "px";
							counter += rate;
						}
						else if(counter === limit) {
							clearInterval(interval);
							if(callback) {
								callback();
							}
							self.queue.advanceQueue();
						}
						else if(counter > limit) {
							var difference = counter - limit;
							parsedRight += difference;
							elem.style.right = parsedRight + "px";
							clearInterval(interval);
							if(callback) {
								callback();
							}
							self.queue.advanceQueue();
						}
					},delay);
				}
				
		},//End of animateRight();	
		
		animateLeft: function(operation,limit,speed,callback) {
				var computedLeft = window.getComputedStyle(this.dom).getPropertyValue('left');
				var elem = this.dom;
				var self = this;
				var parsedLeft = parseInt(computedLeft);
				var counter = 0;
				var interval;
				var delay;//how many milliseconds to delay each increment in elem's left property
				var rate;//by how many pixels elem's left property will be incremented by at a time
				if(speed === "fast") {
					delay = 5;
					rate = 5;
				}
				else if(speed === "slow") {
					delay = 10;
					rate = 1;
				}
				
				if(operation === "inc") {
					interval = setInterval(function() {
						if(counter < limit) {
							parsedLeft += rate;
							elem.style.left = parsedLeft + "px";
							counter += rate;
						}
						else if(counter === limit) {
							clearInterval(interval);
							if(callback) {
								callback();
							}
							self.queue.advanceQueue();
						}
						else if(counter > limit) {
							var difference = counter - limit;
							parsedLeft -= difference;
							elem.style.left = parsedLeft + "px";
							clearInterval(interval);
							if(callback) {
								callback();
							}
							self.queue.advanceQueue();
						}
					},delay);
				}
				else if(operation === "dec") {
					interval = setInterval(function() {
						if(counter < limit) {
							parsedLeft -= rate;
							elem.style.left = parsedLeft + "px";
							counter += rate;
						}
						else if(counter === limit) {
							clearInterval(interval);
							if(callback) {
								callback();
							}
							self.queue.advanceQueue();
						}
						else if(counter > limit) {
							var difference = counter - limit;
							parsedLeft += difference;
							elem.style.left = parsedLeft + "px";
							clearInterval(interval);
							if(callback) {
								callback();
							}
							self.queue.advanceQueue();
						}
					},delay);
				}
				
					
		},//End of animateLeft();
		
		
		animateTop: function(operation,limit,speed,callback) {
				var computedTop = window.getComputedStyle(this.dom).getPropertyValue('top');
				var elem = this.dom;
				var self = this;
				var parsedTop = parseInt(computedTop);
				var counter = 0;
				var interval;
				var delay;//how many milliseconds to delay each increment in elem's top property
				var rate;//by how many pixels elem's top property will be incremented by at a time
				if(speed === "fast") {
					delay = 5;
					rate = 5;
				}
				else if(speed === "slow") {
					delay = 10;
					rate = 1;
				}
				
				if(operation === "inc") {
					interval = setInterval(function() {
						if(counter < limit) {
							parsedTop += rate;
							elem.style.top = parsedTop + "px";
							counter += rate;
						}
						else if(counter === limit) {
							clearInterval(interval);
							if(callback) {
								callback();
							}
							self.queue.advanceQueue();
						}
						else if(counter > limit) {
							var difference = counter - limit;
							parsedTop -= difference;
							elem.style.top = parsedTop + "px";
							clearInterval(interval);
							if(callback) {
								callback();
							}
							self.queue.advanceQueue();
						}
					},delay);
				}
				else if(operation === "dec") {
					interval = setInterval(function() {
						if(counter < limit) {
							parsedTop -= rate;
							elem.style.top = parsedTop + "px";
							counter += rate;
						}
						else if(counter === limit) {
							clearInterval(interval);
							if(callback) {
								callback();
							}
							self.queue.advanceQueue();
						}
						else if(counter > limit) {
							var difference = counter - limit;
							parsedTop += difference;
							elem.style.top = parsedTop + "px";
							clearInterval(interval);
							if(callback) {
								callback();
							}
							self.queue.advanceQueue();
						}
					},delay);
				}
				
					
		},//End of animateTop();
		
		
		animateBottom: function(operation,limit,speed,callback) {
				var computedBottom = window.getComputedStyle(this.dom).getPropertyValue('bottom');
				var elem = this.dom;
				var self = this;
				var parsedBottom = parseInt(computedBottom);
				var counter = 0;
				var interval;
				var delay;//how many milliseconds to delay each increment in elem's bottom property
				var rate;//by how many pixels elem's bottom property will be incremented by at a time
				if(speed === "fast") {
					delay = 5;
					rate = 5;
				}
				else if(speed === "slow") {
					delay = 10;
					rate = 1;
				}
				
				if(operation === "inc") {
					interval = setInterval(function() {
						if(counter < limit) {
							parsedBottom += rate;
							elem.style.bottom = parsedBottom + "px";
							counter += rate;
						}
						else if(counter === limit) {
							clearInterval(interval);
							if(callback) {
								callback();
							}
							self.queue.advanceQueue();
						}
						else if(counter > limit) {
							var difference = counter - limit;
							parsedBottom -= difference;
							elem.style.bottom = parsedBottom + "px";
							clearInterval(interval);
							if(callback) {
								callback();
							}
							self.queue.advanceQueue();
						}
					},delay);
				}
				else if(operation === "dec") {
					interval = setInterval(function() {
						if(counter < limit) {
							parsedBottom -= rate;
							elem.style.bottom = parsedBottom + "px";
							counter += rate;
						}
						else if(counter === limit) {
							clearInterval(interval);
							if(callback) {
								callback();
							}
							self.queue.advanceQueue();
						}
						else if(counter > limit) {
							var difference = counter - limit;
							parsedBottom += difference;
							elem.style.bottom = parsedBottom + "px";
							clearInterval(interval);
							if(callback) {
								callback();
							}
							self.queue.advanceQueue();
						}
					},delay);
				}
				
					
		}//End of animateBottom();
	};
	
	
	//////////////////////////////////////////////////////////////////
	
	//WRAPPER BELOW.
	
	//////////////////////////////////////////////////////////////////
	
	
	
	
	
	
	
	
	//A FUNCTION THAT WILL CREATE A NEW OBJECT THAT WILL APPLY ALL DOM MANIPULATION METHODS TO A SELECTED DOM ELEMENT.
	function createLibObj(elem) {
		
		var DOMHelperObj = {
			dom: elem,
			
			report: function() {
				console.log(this);
			},
			
			queue: new Queue(),
			
			animateRight: function(operation,limit,speed,callback) {
				var self = this;
				//If queue is disabled or empty,execute immediately.
				//validate parameters contained in array.
				if(operation instanceof Array === true) {
					//Loop through all the elements in the user passed array.
					for(var i = 0;i < operation.length;i++) {
						//Check each one.
						switch(i) {
							case 0:
								if(operation[i] !== "inc" && operation[i] !== "dec") {
									console.log("You need to fix the operation param");
									return;
								}
								break;
							case 1:
								if(typeof operation[i] !== "number") {
									console.log("You need to fix the limit param");
									return;
								}
								break;
							case 2:
								if(operation[i] !== "fast" && operation[i] !== "slow") {
									console.log("You need to fix the speed param");
									return;
								}
								break;
							case 3:
								if(operation[i] !== undefined) {
									if(operation[i] instanceof Function === false) {
										console.log("You need to fix the callback param");
										return;
									}
								}
								break;
							default:
								//do nothing.
								break;
						}
					}
					if(this.queue.enabled === true) {
						this.queue.enqueue(FX.animateRight,operation,self);
					}
					else {
						FX.animateRight.apply(self,operation);
					}
					
				}
				else {
					//Loop through the user passed arguments.
					for(var i = 0;i < arguments.length;i++) {
						//Check each one.
						switch(i) {
							case 0:
								if(arguments[i] !== "inc" && arguments[i] !== "dec") {
									console.log("You need to fix the operation param");
									return;
								}
								break;
							case 1:
								if(typeof arguments[i] !== "number") {
									console.log("You need to fix the limit param");
									return;
								}
								break;
							case 2:
								if(arguments[i] !== "fast" && arguments[i] !== "slow") {
									console.log("You need to fix the speed param");
									return;
								}
								break;
							case 3:
								if(arguments[i] !== undefined) {
									if(arguments[i] instanceof Function === false) {
										console.log("You need to fix the callback param");
										return;
									}
								}
								break;
							default:
								//do nothing.
								break;
						}
					}
					if(this.queue.enabled === true) {
						this.queue.enqueue(FX.animateRight,arguments,self);
					}
					else {
						FX.animateRight.apply(self,arguments);
					}
				}
				
				return this;
			},
		
			animateLeft: function(operation,limit,speed,callback) {
				var self = this;
				//validate parameters contained in array.
				if(operation instanceof Array === true) {
					for(var i = 0;i < operation.length;i++) {
						switch(i) {
							case 0:
								if(operation[i] !== "inc" && operation[i] !== "dec") {
									console.log("You need to fix the operation param");
									return;
								}
								break;
							case 1:
								if(typeof operation[i] !== "number") {
									console.log("You need to fix the limit param");
									return;
								}
								break;
							case 2:
								if(operation[i] !== "fast" && operation[i] !== "slow") {
									console.log("You need to fix the speed param");
									return;
								}
								break;
							case 3:
								if(operation[i] !== undefined) {
									if(operation[i] instanceof Function === false) {
										console.log("You need to fix the callback param");
										return;
									}
								}
								break;
							default:
								//do nothing.
								break;
						}
					}
					if(this.queue.enabled === true) {
						this.queue.enqueue(FX.animateLeft,operation,self);
					}
					else {
						FX.animateLeft.apply(self,operation);
					}
				}
				else {
					for(var i = 0;i < arguments.length;i++) {
						switch(i) {
							case 0:
								if(arguments[i] !== "inc" && arguments[i] !== "dec") {
									console.log("You need to fix the operation param");
									return;
								}
								break;
							case 1:
								if(typeof arguments[i] !== "number") {
									console.log("You need to fix the limit param");
									return;
								}
								break;
							case 2:
								if(arguments[i] !== "fast" && arguments[i] !== "slow") {
									console.log("You need to fix the speed param");
									return;
								}
								break;
							case 3:
								if(arguments[i] !== undefined) {
									if(arguments[i] instanceof Function === false) {
										console.log("You need to fix the callback param");
										return;
									}
								}
								break;
							default:
								//do nothing.
								break;
						}
					}
					if(this.queue.enabled === true) {
						this.queue.enqueue(FX.animateLeft,arguments,self);
					}
					else {
						FX.animateLeft.apply(self,arguments);
					}
				}
				return this;
			},		
		
			animateTop: function(operation,limit,speed,callback) {
				var self = this;
				//validate parameters contained in array.
				if(operation instanceof Array === true) {
					for(var i = 0;i < operation.length;i++) {
						switch(i) {
							case 0:
								if(operation[i] !== "inc" && operation[i] !== "dec") {
									console.log("You need to fix the operation param");
									return;
								}
								break;
							case 1:
								if(typeof operation[i] !== "number") {
									console.log("You need to fix the limit param");
									return;
								}
								break;
							case 2:
								if(operation[i] !== "fast" && operation[i] !== "slow") {
									console.log("You need to fix the speed param");
									return;
								}
								break;
							case 3:
								if(operation[i] !== undefined) {
									if(operation[i] instanceof Function === false) {
										console.log("You need to fix the callback param");
										return;
									}
								}
								break;
							default:
								//do nothing.
								break;
						}
					}
					if(this.queue.enabled === true) {
						this.queue.enqueue(FX.animateTop,operation,self);
					}
					else {
						FX.animateTop.apply(self,operation);
					}
				}
				else {
					for(var i = 0;i < arguments.length;i++) {
						switch(i) {
							case 0:
								if(arguments[i] !== "inc" && arguments[i] !== "dec") {
									console.log("You need to fix the operation param");
									return;
								}
								break;
							case 1:
								if(typeof arguments[i] !== "number") {
									console.log("You need to fix the limit param");
									return;
								}
								break;
							case 2:
								if(arguments[i] !== "fast" && arguments[i] !== "slow") {
									console.log("You need to fix the speed param");
									return;
								}
								break;
							case 3:
								if(arguments[i] !== undefined) {
									if(arguments[i] instanceof Function === false) {
										console.log("You need to fix the callback param");
										return;
									}
								}
								break;
							default:
								//do nothing.
								break;
						}
					}
					if(this.queue.enabled === true) {
						this.queue.enqueue(FX.animateTop,arguments,self);
					}
					else {
						FX.animateTop.apply(self,arguments);
					}
				}
				return this;
			},

			animateBottom: function(operation,limit,speed,callback) {
				var self = this;
				//validate parameters contained in array.
				if(operation instanceof Array === true) {
					for(var i = 0;i < operation.length;i++) {
						switch(i) {
							case 0:
								if(operation[i] !== "inc" && operation[i] !== "dec") {
									console.log("You need to fix the operation param");
									return;
								}
								break;
							case 1:
								if(typeof operation[i] !== "number") {
									console.log("You need to fix the limit param");
									return;
								}
								break;
							case 2:
								if(operation[i] !== "fast" && operation[i] !== "slow") {
									console.log("You need to fix the speed param");
									return;
								}
								break;
							case 3:
								if(operation[i] !== undefined) {
									if(operation[i] instanceof Function === false) {
										console.log("You need to fix the callback param");
										return;
									}
								}
								break;
							default:
								//do nothing.
								break;
						}
					}
					if(this.queue.enabled === true) {
						this.queue.enqueue(FX.animateBottom,operation,self);
					}
					else {
						FX.animateBottom.apply(self,operation);
					}
				}
				else {
					for(var i = 0;i < arguments.length;i++) {
						switch(i) {
							case 0:
								if(arguments[i] !== "inc" && arguments[i] !== "dec") {
									console.log("You need to fix the operation param");
									return;
								}
								break;
							case 1:
								if(typeof arguments[i] !== "number") {
									console.log("You need to fix the limit param");
									return;
								}
								break;
							case 2:
								if(arguments[i] !== "fast" && arguments[i] !== "slow") {
									console.log("You need to fix the speed param");
									return;
								}
								break;
							case 3:
								if(arguments[i] !== undefined) {
									if(arguments[i] instanceof Function === false) {
										console.log("You need to fix the callback param");
										return;
									}
								}
								break;
							default:
								//do nothing.
								break;
						}
					}
					if(this.queue.enabled === true) {
						this.queue.enqueue(FX.animateBottom,arguments,self);
					}
					else {
						FX.animateBottom.apply(self,arguments);
					}
				}
				return this;
			}
			
			
			
		};
		//DOMHelperObj.report();
		
		return DOMHelperObj;
	}//End of createLibObj
	
	//Returns the page coordinates of the passed in element.
	function getXY(elem) {
		var boxRect = elem.getBoundingClientRect();
		elem.x = boxRect.left;
		elem.y = boxRect.top;
	}
	


	window.$ = DOMHelper.findElement;
	window.DOMHelper = DOMHelper;
})();