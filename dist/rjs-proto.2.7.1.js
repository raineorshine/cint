/** Installs string, number, array, and function methods from RJS to native object prototypes. 
	v2.7.1
	@requires rjs.2.7.1.js
*/

RJS.install(String, RJS, ["supplant", "trim", "startsWith", "before", "after", "between", { repeatString: "repeat" }, "toTitleCase", { strContains: "contains" } ]);
RJS.install(Number, RJS, ["ordinal", { mapNumber: "map" }]);
RJS.install(Array, RJS, ["map", "each", "pluck", "group", "orderedGroup", "tally", "contains", "strictContains", "unique", "reversed", "index", "rotate", "toObject", "find", "findByProperty", "filterBy", "any", "all" ]);
RJS.install(Function, RJS, ["curry", "currify", "toInstance", "new"]);
