/** Build a table with the given JSON data. Takes dictionaries of functions to format the header, values, and sorttable sort field. */
function buildTable(data/*, config1, ...*/) {

	if(!data || !data.length) {
		throw new Error("Invalid data.");
	}

	// merge inner properties on config objects
	var configs = Array.prototype.slice.call(arguments, 1);
	tableAttributes =	merge.apply(this, configs.pluck("tableAttributes").filter(hasValue));
	headerFormatters =	merge.apply(this, configs.pluck("headerFormatters").filter(hasValue));
	formatters =		merge.apply(this, configs.pluck("formatters").filter(hasValue));
	sorters =			merge.apply(this, configs.pluck("sorters").filter(hasValue));
	additionalColumns =	merge.apply(this, configs.pluck("additionalColumns").filter(hasValue));
	pager =				merge.apply(this, configs.pluck("pager").filter(hasValue));
	ignoreColumns =		[].concat.apply([], configs.pluck("ignoreColumns").filter(hasValue));

	return ["table.hor-minimalist-b", tableAttributes, [
		["thead", {}, [
			buildTableHeaderRow(headerFormatters, ignoreColumns, keys(data[0]).concat(keys(additionalColumns)), sorters)
		]],
		["tbody", {}, data.map(function(row) { return buildTableRow(row, formatters, additionalColumns, ignoreColumns); })],
		!isEmpty(pager) ?
			["tfoot", {}, [
				["tr", {}, [
					["td", {colspan: 100}, [buildPager(pager)]]
				]]
			]] :
			null
	]];
}

function buildTableHeaderRow(headerFormatters, ignoreColumns, columns, sorters) {
	return ["tr", {}, columns.map(function(column) {
		if(inArray(ignoreColumns, column)) {
			return null;
		}
		else {
			return ["th", {}, [
				["a", {"data-sort": sorters[column] || (column + " ASC")}, 
					column in headerFormatters ? headerFormatters[column] : column
				]
			]];
		}
	})];
}

function buildTableRow(row, formatters, additionalColumns, ignoreColumns) {

	function buildTableCell(key, value) { 

		if(inArray(ignoreColumns, key)) {
			return null;
		}
		else {
			var formattedValue = key in formatters ? formatters[key](value, row) : value;
			// client-side sorting disabled
			//var customSortValue = key in sorters ? sorters[key](row) : null;
			return ["td", {/*sorttable_customkey: customSortValue*/}, formattedValue]; 
		}
	}

	var row = merge(row, map(additionalColumns, function(column, valueFunction) { return valueFunction(row); }));
	return ["tr", {}, 
		values(map(row, buildTableCell))
	];
}

function buildPager(config) {
	var currentPage = Math.floor(config.currentRow/config.pageLength);
	var totalPages = Math.floor(config.totalRows/config.pageLength);
	var start = Math.max(0, currentPage - config.pagesEachSide);
	var end = Math.min(totalPages, currentPage + config.pagesEachSide);

	//console.log(currentPage, totalPages, start, end);
	//console.log(range(start, currentPage-1));
	//console.log(range(currentPage+1, end));

	function buildPagerLink(page) {
		var row = page * config.pageLength;
		return ["a", {"data-row": row}, page+1];
	}

	return ["div.pager", {}, [].concat(
		start > 0 ? [buildPagerLink(0)] : null,
		start > 1 ? [["span.divider", {}, " ... "]] : null,
		range(start, currentPage-1).map(buildPagerLink),
		[["span.currentPage", {}, currentPage+1]],
		range(currentPage+1, end).map(buildPagerLink),
		end < totalPages-1 ? [["span.divider", {}, " ... "]] : null,
		end < totalPages ? [buildPagerLink(totalPages)] : null
	)];
}

/** Returns the markup expression for a Google chart configured with the given data. 
	@param config {
		type,
		width,
		height,
		data
	}
*/
function buildGoogleChart(config) {
	var googleChartsUrlBase = "http://chart.apis.google.com/chart?";
	var typeMap = {
		pie: "p",
		pie3d: "p3"
	};

	// a dictionary of google params indexed by the parameter key (like chd) that is sent on the url string
	var googleConfig = {};
	if(config.width && config.height) {
		googleConfig.chs = "{0}x{1}".format(config.width, config.height);
	}
	if("type" in config) {
		googleConfig.cht = typeMap[config.type];
	}
	if("data" in config) {
		googleConfig.chd = "t:" + config.data.join(",");
	}
	if("colors" in config) {
		googleConfig.chco = config.colors.join(",");
	}
	if("rotation" in config) {
		googleConfig.chp = config.rotation;
	}
	return ["img", {src: googleChartsUrlBase + joinObj(googleConfig, "&", "=")}];
}

