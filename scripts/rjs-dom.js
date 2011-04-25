/*global each,inArray,filter */

/** 
 * Raine's Javascript Extensions for the DOM
 * Last Updated: 11/10/09
 * See jQuery.create.js for updated version.
 */

/** Creates an element from the given HTML s-expression.
 * @param sexp[0]		Tag name
 * @param sexp[1]		Attributes
 * @param sexp[2]		Children
 */
create = function(sexp) {

	// validate arguments
	if(sexp.length === 0) {
		throw new Error("create -> Not enough arguments. You must at least specify a tag name.");
	}
	if(typeof sexp[0] !== "string") {
		throw new Error("create -> Invalid tag name: {0} ({1})".format(sexp[0], typeof sexp[0]));
	}
	if(typeof sexp[1] !== "object" && sexp[1] !== undefined) {
		throw new Error("create -> Invalid attributes: " + sexp[1]);
	}

	var tagNameString = sexp[0];
	var attrs = sexp[1];
	var children = sexp[2];

	// create the element and parse its attributes and children
	var element = parseTagName(tagNameString);
	if(attrs) {
		parseAttributes(element, attrs);
	}
	if(children) {
		parseChildren(element);
	}

	return element;


	/******************************************
	 * Parsing Functions
	 ******************************************/

	/** Parses the tagName for CSS selector syntax and returns a newly created element. */
	function parseTagName(tagNameString) {
		var tagName = tagNameString.split(/[#.]/)[0] || "div";
		var selectors = tagNameString.substring(tagNameString.indexOf(/[#.]/)).match(/[#.][^#.]+/g) || [];

		var el = document.createElement(tagName);
		each(selectors, function(selector) {
			if(selector[0] === "#") {
				el.setAttribute("id", selector.substring(1));
			}
			else if(selector[0] === ".") {
				addClass(el, selector.substring(1));
			}
		});
		return el;
	}

	/** Parses the attributes and adds them to the element. */
	function parseAttributes(element, attrs) {

		var attrDisplayMap = {
			className : "class",
			htmlFor : "for"
		};

		for(attr in attrs) {
			if(isValue(attrs[attr])) {
				if(attr.toLowerCase() === "events" && typeof Events !== "undefined") {
					parseEvents(element, attrs);
				}
				else if(attr === "className" || attr === "class") {
					addClass(element, attrs[attr]);
				}
				else {
					element.setAttribute(attrDisplayMap[attr] || attr, attrs[attr]);
				}
			}
		}

		// default attributes (syntactic sugar)
		if(element.tagName.toLowerCase() === "a" && !("href" in attrs) && !("name" in attrs)) {
			element.setAttribute("href", "javascript:void(0);");
		}
		if(element.tagName.toLowerCase() === "img" && !("alt" in attrs)) {
			element.setAttribute("alt", "");
		}
	}

	/** Parses inline event attachment. */
	function parseEvents(element, attrs) {
		var events = [].concat(attrs[attr]);

		each(events, function(eventObject) {
			var eventArgs = {};
			// if a function is given directly for a link, assume it is a click event (syntactic sugar)
			if(typeof eventObject === "function") {
				if(element.tagName.toLowerCase() === "a") {
					eventArgs.element = element;
					eventArgs.type = "click";
					eventArgs.handler = eventObject;
				}
				else {
					throw new Error("There is no default event handler type for {0} elements".format(element.tagName));
				}
			}
			else {
				eventArgs = eventObject;
				if(tagName.toLowerCase() === "a") { // use 'click' as the default event for links
					eventArgs.type = "click";
				}
			}
			eventArgs.element = element;
			Events.add(eventArgs);
		});
	}

	/** Adds the given className to the elements class attribute. */
	function addClass(element, className) {
		element.setAttribute("class", element.hasAttribute("class") ? element.getAttribute("class") + " " + className : className);
	};

	/** Parses the element's children. */
	function parseChildren(element) {
		if(typeof children === "string" || typeof children === "number") {
			element.innerHTML = children;
		}
		else if(children instanceof Array) {
			each(children, function(child) {
				if(isValue(child)) {
					element.appendChild(
						// handles children as DomNodes, strings & numbers, and s-expression (recursive)
						isDomNode(child) ? child : 
						typeof child === "string" || typeof child === "number" ? document.createTextNode(child) :
						child instanceof Array ? create(child) : // RECURSION
						(function() { console.error("Invalid child of", element, ":", child); })()
					);
				}
			});
		}
		else {
			throw new Error("Unrecognized child type");
		}
	}


	/******************************************
	 * Helper Functions
	 ******************************************/
	
	/** Returns true if the object is not equal to null or undefined. */
	function isValue(obj) {
		return obj !== null && obj !== undefined;
	}

	/** Returns true if the given object seems to be a DomNode. */
	function isDomNode(node) {
		return typeof node.nodeType == "number";
	}

};

/** Removes all child nodes from the given element. */
removeChildNodes = function(element) {
	while(element.hasChildNodes()) {
		element.removeChild(element.lastChild);
	}
};

/** Converts angled brackets to their html encoded value. */
encodeBrackets = function(str) {
	return str
		.replace(/</,"&lt;")
		.replace(/>/,"&gt;");
};

/** Invokes the given function on the given node and each of its child nodes (recursive). */
traverse = function(node, f) {
	if(node.nodeType === 1) {
		f(node);
		each(node.childNodes, function(child) {
			traverse(child, f); // RECURSION
		});
	}
};

/** Adds the given CSS class to the node. */
addClass = function(node, className) {
	var currentClass = " " + node.getAttribute("class") + " ";
	if(currentClass.indexOf(" " + className + " ") === -1) {
		node.setAttribute("class", (currentClass + className).trim());
	}
};

