//global $, hash, merge, guid, String.format

/** Build client-side modules from an Ajax request that are smart enough to know how to refresh its contents along with any inputs that were changed by the user. */
var SmartModule = function() {
	this.baseUrl = baseUrl;
	this.requestCache = {};
	this.ajaxLoader = null;
	this.moduleTagName = "span";
	this.moduleClassName = "module";
};

/** Makes an ajax request to the given module url and returns a placeholder module div. When the ajax request returns a response, the placeholder is filled with the results of the given build function (which takes the module response data). */
SmartModule.prototype.buildAjaxModule = function(module, requestData, build, postBuild) {

	requestData = requestData || {};
	requestData.module = requestData.module || module; // default to given module, but allow requestData.module to be set separately for refreshes.

	var cacheKey = module + guid();
	var moduleMarkup = $("<{0} class='{1}'".format(this.moduleTagName, this.moduleClassName))
		.data("module", cacheKey)
		.append(this.ajaxLoader ?  $("<img>").attr("src", this.ajaxLoader) : null);

	var requestKey = "{0}|{1}".format(module, hash(merge(requestData, { module: module })));
	if(!(requestKey in this.requestCache)) {
		this.requestCache[requestKey] = $.ajax({
			url: this.baseUrl,
			data: merge(requestData, { module: module }) // merge the given module name for the initial request, preserve requestData.module for refreshes
		});
	}

	this.requestCache[requestKey].success(function(data, textStatus, request) {

		var moduleEl = $("{0}.{1}[data-module={2}]".format(this.moduleTagName, this.moduleClassName, cacheKey));
		moduleEl.data("requestData", requestData);
		//moduleEl.data("responseData", data);
		moduleEl.data("build", build); // store a reference to the build function so that the module can be rebuilt after an ajax refresh
		moduleEl.data("postBuild", postBuild);
		moduleEl.empty();

		// check for module error
		if(data.status == "error") {
			console.error(data.message);
		}
		// otherwise build the module, set the html, and call the post-build function
		else {
			// this is a weird line because we have closure over moduleMarkup, but if this is not called immediately (that is, if the response is not cached), then moduleMarkup doesn't have any other effect, but if it is called immediately, we simply return the built module instead of the placeholder
			moduleMarkup = build(data, requestData);
			moduleEl.html(moduleMarkup);

			if(postBuild) {
				postBuild(moduleEl);
			}
		}
	});

	return moduleMarkup;
}

// TODO: Refactor
/** Refreshes the content of the given module (or parent module of a given element) by making an ajax request to the module url and calling the associated build function (put in place by buildAjaxModule). Adds the given data to the request. */
function refreshModule(el, module, requestData, build, postBuild) {
	var moduleEl = el.hasClass("module") ? el : el.parents(".module");
	var requestData = merge(moduleEl.data("requestData") || {}, requestData, { isRefresh: true });
	moduleEl.css("opacity", 0.3);

	// For some reason these argument will *not* be closed over if we don't assign it to a local variable here.
	var buildClosure = build;
	var postBuildClosure = postBuild;

	$.ajax({
		url: this.baseUrl, 
		data: merge(requestData, { module: module }),
		success: function(data, textStatus, request) {
			//moduleEl.fadeIn(2000);
			moduleEl.css("opacity", 1);
			moduleEl.data("requestData", requestData);
			//moduleEl.data("responseData", data);
			moduleEl.empty();

			// check for module error
			if(data.status == "error") {
				console.error(data.message);
			}
			// otherwise build the module, set the html, and call the post-build function
			else {
				var build = buildClosure || moduleEl.data("build");
				var postBuild = postBuildClosure || moduleEl.data("postBuild");

				moduleEl.html(create(build(data, requestData)));
				if(postBuild) {
					postBuild(moduleEl);
				}
			}
		}/*,
		error: function(a, b, c) {
			console.log(a, b, c);
		}*/
	});
}
