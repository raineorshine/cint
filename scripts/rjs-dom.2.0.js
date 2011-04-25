/** 
 * Raine's Javascript Extensions for the DOM
 */

/** Creates an element from the given HTML s-expression.
 * @param sexp[0]		Tag name
 * @param sexp[1]		Attributes
 * @param sexp[2]		Children
 */
create = function(sexp) {

	if(sexp === null) {
		return null;
	}

	// validate arguments
	if(sexp.length === 0) {
		throw new Error("create -> Not enough arguments. You must at least specify a tag name.");
	}
	if(typeof sexp[0] !== "string") {
		throw new Error("create -> Invalid tag name: {0} ({1})".format(sexp[0], typeof sexp[0]));
	}
	if(typeof sexp[1] !== "object" && sexp[1] !== undefined) {
		console.error("create -> Invalid attributes");
		console.error(sexp[1]);
		throw new Error("create -> Invalid attributes: " + sexp[1]);
	}

	var tagNameString = sexp[0];
	var attrs = sexp[1];
	var children = sexp[2];

	// create the element and parse its attributes and children
	var element = tagNameString == "fragment" ?
		document.createDocumentFragment() : parseTagName(tagNameString);

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

		if(!element || element.nodeType != 1) {
			return;
		}

		var attrDisplayMap = {
			className : "class",
			htmlFor : "for"
		};

		for(attr in attrs) {
			if(isValue(attrs[attr])) {
				if(attr.toLowerCase() === "events") {
					parseEvents(element, attrs);
				}
				else if(attr === "className" || attr === "class") {
					addClass(element, attrs[attr]);
				}
				// allow style attribute value to be passed in as a dictionary
				else if(attr === "style" && typeof(attrs[attr]) === "object") {
					element.setAttribute("style", joinObj(attrs[attr], "; ", ":") + ";");
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

	/** Adds the given className to the elements class attribute. */
	function addClass(element, className) {
		element.setAttribute("class", element.hasAttribute("class") ? element.getAttribute("class") + " " + className : className);
	};

	/** Parses the element's children. */
	function parseChildren(element) {
		if(typeof children === "string" || typeof children === "number") {
			element.appendChild(document.createTextNode(children));
		}
		else if(children instanceof Array) {
			each(children, function(child) {
				if(isValue(child)) {
					element.appendChild(
						// handles children as DomNodes, strings & numbers, and s-expression (recursive)
						isDomNode(child) ? child : 
						typeof child === "string" || typeof child === "number" ? document.createTextNode(child) :
						child instanceof Array ? create(child) : // RECURSION
						(function() { throw new Error("Invalid child: " + child); })()
					);
				}
			});
		}
		else {
			throw new Error("Unrecognized child type");
		}
	}

	/** Parses inline event attachment. */
	function parseEvents(element, attrs) {
		var events = [].concat(attrs[attr]);

		each(events, function(eventObject) {
			var eventArgs = {};
			// if a function is given directly for a link, assume it is a click event
			if(typeof eventObject === "function") {
				if(element.tagName.toLowerCase() === "a") {
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
			$(element).bind(eventArgs.type, eventArgs.handler);
		});
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

/** Invokes a function on the given node and each of its child nodes (recursive). */
var traverse = function(node, f) {
	if(node.nodeType === 1) {
		f(node);
		each(node.childNodes, function(child) {
			traverse(child, f); // RECURSION
		});
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

/** Creates an element from the given s-expression just like create but returns HTML text instead of a DOM element. 
	Note: Doesn't handle elements that cannot be added to a div.
*/
createHtml = function(sexp) {
	return create(["div", {}, [sexp]]).innerHTML;
};

/** Array overrides. Pretty invasive but if it doesn't create problems makes an easy way to modify markup objects after creation. */
Array.prototype.addAttributes = function(obj) {
	this[1] = merge(this[1], obj);
	return this;
}

Array.prototype.addClass = function(className) {
	var attrs = this[1];
	attrs["class"] = "class" in attrs ? " " + className : className;
	return this;
}

Array.prototype.setContent = function(content) {
	this[2] = content;
	return this;
}

/** Make query string parameters easily available. */
queryParams = unescape(location.search).substring(1).split("&").toDict(function(queryKeyValue) { return queryKeyValue.split("="); });

autozindexNumber = 10;
autozindex = function() {
	return ++autozindexNumber;
}
