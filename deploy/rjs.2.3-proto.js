/** Installs string, number, array, and function methods from RJS to native object prototypes. 
	@requires rjs.2.0.js
*/

RJS.install(String, RJS, ["supplant", "trim", "startsWith", "before", "after", "between", { repeatString: "repeat" }, "toTitleCase"]);
RJS.install(Number, RJS, ["ordinal", { mapNumber: "map" }]);
RJS.install(Array, RJS, ["map", "group", "orderedGroup", "tally", "contains", "strictContains", "unique", "reversed", "index", "rotate", "toObject", "find", "findByProperty", "filterBy" ]);
RJS.install(Function, RJS, ["toInstance", "new"]);
