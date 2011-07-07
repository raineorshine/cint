// requires: rjs.1.1.js

/************************************************************************************
 * Class Definition
 ************************************************************************************/

// define root namespace
var VisualDeck = function() {

	/** A list of custom tags. The replacement function will be called for each appearance of [tagName]...[/tagName]. The 1st argument to the replacement function is the entire match and the 2nd argument is the contents of the tag. */
	// this constant is not defined on the prototype because it references other class functions
	this.customTags = [
		{ tagName: "card", replaceFunc: this.replaceCard },
		{ tagName: "deck", replaceFunc: this.replaceDeck }
	];
};


/************************************************************************************
 * Constants
 ************************************************************************************/
//VisualDeck.prototype.magicCardsInfoUrlBase = "http://magiccards.info/query?q=";
VisualDeck.prototype.magicCardsInfoUrlBase = location.pathname + "?page=card&name=";
VisualDeck.prototype.imageUrlBase = location.pathname + "images/cards/";

// The standard height of card images.
VisualDeck.prototype.cardHeight = 285;
VisualDeck.prototype.cardWidth = 200;
VisualDeck.prototype.maxStackSize = 4;
VisualDeck.prototype.thumbnailWidth = 100;

VisualDeck.prototype.cardImageSizeWidths = {
	icon: 32,
	small: 100
};
VisualDeck.prototype.cardImageSizeFolders = {
	icon: "icon/",
	small: "small/",
	large: "large/"
};

/** A dictionary used to map what cards are affectionately known by to their actual card namel */
VisualDeck.prototype.cardNicknames = {
	"Jeff" : "Jace, the Mind Sculptor",
	"Jeffrey" : "Jace, the Mind Sculptor",
	"Jeffrey Jazzhands" : "Jace, the Mind Sculptor",
	"Jeffrey Jazz-hands" : "Jace, the Mind Sculptor",
	"Jace" : "Jace, the Mind Sculptor",
	"Jace 2.0" : "Jace, the Mind Sculptor",
	"Jace 1.0" : "Jace Beleren",
	"DJ Jace" : "Jace Beleren",
	"Sarah" : "Elspeth, Knight-Errant",
	"Sarah 2.0" : "Elspeth Tirel",
	"Venser" : "Venser, the Sojourner",
	"Garruk" : "Garruk Wildspeaker",
	"Creeping Shit Pool" : "Creeping Tar Pit",
	"Kozilek" : "Kozilek, Butcher of Truth",
	"Ulamog" : "Ulamog, the Infinite Gyre",
	"Emrakul" : "Emrakul, the Aeons Torn",
	"Linvala" : "Linvala, Keeper of Silence"
};

/************************************************************************************
 * Utility Functions
 ************************************************************************************/

VisualDeck.prototype.replaceCard = function(match, attrString, cardName) {

	var attrs = VisualDeck.parseAttributes(attrString);
	
	if(attrs.view == "visual") {
		return createHtml(VisualDeck.buildCardImage(attrs.name || cardName, "small"));
	}
	else {
		return createHtml(["a.card", { 
			href: VisualDeck.getLinkUrl(attrs.name || cardName),
			"data-name": attrs.name
		}, cardName]);
	}
};

/** Returns a dictionary of attributes parsed from the given attribute string. */
VisualDeck.prototype.parseAttributes = function(attrString) {

	attrString = attrString || "";
	var re = /(\S+)=["']?((?:.(?!["']?\s+(?:\S+)=|[>"']))+.)["']?/g;
	var dict = {};
	while(match = re.exec(attrString)) {
		dict[match[1]] = match[2];
	};

	return dict;
};

VisualDeck.prototype.replaceNumberedCard = function(match, cardNumber, cardName) {
	return "{0} {1}".format(cardNumber, VisualDeck.replaceCard(null, null, cardName));
};

VisualDeck.prototype.replaceDeck = function(match, attrString, contents) {
	var attrs = VisualDeck.parseAttributes(attrString);
	var re = /(\d+) ([^<]*)/g; // stopping on the < character (assuming <br>) is pretty loose

	var newContents;
	if(attrs.view == "visual") {
		var deck = new Deck(contents);
		newContents = createHtml(["div.deck", {}, [deck.cards.map(VisualDeck.buildCardStack)]]);
	}
	else {
		newContents = contents.replace(re, VisualDeck.replaceNumberedCard);
	}

	return newContents;
};

/** Constructs the URL to the MagicCards.info card lookup. */
VisualDeck.prototype.getLinkUrl = function(cardName) {
	var cardName = VisualDeck.cardNicknames[cardName] || cardName;
	return VisualDeck.magicCardsInfoUrlBase + cardName;
};

/** Constructs the URL to the image of the given card name. */
VisualDeck.prototype.getImageUrl = function(card, size) {
	var cardName = VisualDeck.cardNicknames[card.name] || card.name;
	//return "http://www.wizards.com/global/images/magic/general/{0}.jpg".format(cardName.replace(/[- ]/g, "_").replace(/[',]/g, ""));
	return "{0}{1}{2}.{3}".format(
		VisualDeck.imageUrlBase, 
		VisualDeck.cardImageSizeFolders[size] || "", 
		card.nameEncrypted,
		size == "large" ? "jpg" : "png"
	);
};

/** Replaces custom tags with the result of a replacement function.
	@arg customTags		An array of customTag items that define the tag name and replacement function
	@arg root			The root element to replace the contents of
*/
VisualDeck.prototype.replaceTags = function(customTags, root) {
	var newHtml = root.html();

	// for each tag in the customTags dictionary, search the html for that tag and call the associated replacement function
	each(customTags, function(tag) {
		var re = new RegExp("\\[{0}([^\\]]*)?\\](.*?)\\[\\/{0}\\]".format(tag.tagName), "g");
		newHtml = newHtml.replace(re, tag.replaceFunc);
	});

	// Replace [[Card Name]] with card link as well
	newHtml = newHtml.replace(/\[\[(.*?)\]\]/g, function(match, cardName) { return VisualDeck.replaceCard(null, null, cardName); });

	root.html(newHtml);
};

/** Calculate a hypergeometric distribution from the probabilities panel. */
VisualDeck.prototype.hyperCalculate = function() {
	$("#hyperOutput").val("");

	var maxTarget = !!$("#hyperAtLeast").val() ? Math.min($("#hyperNumberOfDraws").val(), $("#hyperNumberInDeck").val()) : $("#hyperTargetNumber").val();
	var output = 0;
	for(var i=$("#hyperTargetNumber").val(); i<=maxTarget; i++) {
		output += hyper(
			i,
			$("#hyperNumberInDeck").val(),
			$("#hyperNumberOfDraws").val(),
			$("#hyperTotalCardsInDeck").val()
		);
	}
	$("#hyperOutput").val(output);
};

VisualDeck.prototype.buildSlices = function(deck) {
	return ["div.slices", {}, deck.cards.map(function(card, i) { 
		return VisualDeck.buildCardImage(card, "small").addAttributes({ style: "clip: rect({0}px, 100px, {1}px, 0px)".format(i*10, 142 - (i-1)*10) }); 
	})];
};


/************************************************************************************
 * Build
 ************************************************************************************/

/** Creates an image element of the given card. */
VisualDeck.prototype.buildCardThumbnail = function(card, size) {
	return ["a", { href: VisualDeck.getLinkUrl(card.name) }, [
		VisualDeck.buildCardImage(card, size).addClass("thumbnail")
	]];
};

/** Creates an image element of the given card. */
VisualDeck.prototype.buildCardImage = function(card, size) {
	return ["img.card." + size, { src: VisualDeck.getImageUrl(card, size), alt: card.name, width: VisualDeck.cardImageSizeWidths[size] }];
};

VisualDeck.prototype.buildCardBackStack = function(size) {
	var imageUrl = "{0}{1}card-back-stack.png".format(VisualDeck.imageUrlBase, VisualDeck.cardImageSizeFolders[size] || "");
	return ["img.cardBackStack", { src: imageUrl }];
};

VisualDeck.prototype.buildCardStack = function(card) {

	if(card.count > 4) {
		return ["div.cardStack", {}, [
			["span.overlayCount", {}, card.count], 
			VisualDeck.buildCardThumbnail(card, "small")
		]];
	}
	else {

		return ["div.cardStack", {}, 
			range(0,card.count-1).map(function(n) {
				var cascadeOffsetTop = 13;
				var cascadeOffsetLeft = 7;
				var stackMarginTop = card.count * cascadeOffsetTop;
				var stackMarginLeft = card.count * cascadeOffsetLeft;

				var img = VisualDeck.buildCardThumbnail(card, "small");

				// the first card in the stack needs bottom and right margin to keep the other stacks from overlapping
				//img[1].style = (n === 0) ? 
				//	"margin-bottom: {0}px; margin-right: {1}px".format(stackMarginTop, stackMarginLeft) :
				//	"position: absolute; margin-top: {0}px; margin-left: {1}px".format(
				//		n * cascadeOffsetTop, -VisualDeck.thumbnailWidth - stackMarginLeft + n * cascadeOffsetLeft
				//	);

				return img;
			})
		];
	}
};

VisualDeck.prototype.buildVisualDeck = function(deck, config) {
	config = config || {};
	groupsByRoughType = deck.cards.group(function(card) { return card.roughType(); });

	if(config.grouped) {
		return ["div.deck", {}, [
			//values(map(groupsByRoughType, function(roughType, cards) {
			//	return ["div.deckRow", {}, cards
			//		.sort(Card.prototype.compareCastingCost)
			//		.map(VisualDeck.buildCardStack)
			//	];
			//}))
			["div.deckRow", {}, 
				(groupsByRoughType["spell"] || [])
					.sort(Card.prototype.compareCastingCost)
					.map(VisualDeck.buildCardStack)
			],
			//["div.deckRow", {}, 
			//	(groupsByRoughType["creature"] || [])
			//		.sort(Card.prototype.compareCastingCost)
			//		.map(VisualDeck.buildCardStack)
			//],
			["div.deckRow", {}, 
				(groupsByRoughType["land"] || [])
					.sort(Card.prototype.compareCastingCost)
					.map(VisualDeck.buildCardStack)
			]
		]];
	}
	else {
		return ["div.deck", {}, deck.cards
			.sort(Card.prototype.compareCastingCost)
			.map(VisualDeck.buildCardStack)
		];
	}
};

/************************************************************************************
 * Events
 ************************************************************************************/

/** Handles the event that he card link is moused over. Appends and positions the hover card image. */
VisualDeck.prototype.onCardLinkOver = function(e) {
	var el = $(e.target);
	var hoverImage = $(createHtml(VisualDeck.buildCardImage(el.attr("data-name") || el.text()))).attr("id", "hoverCard");
	el.after(hoverImage);

	// move the image within view if it would fall below the bottom/right of the window
	var windowBottom = $(window).scrollTop() + $(window).height();
	var windowRight = $(window).scrollLeft() + $(window).width();
	if(hoverImage.offset().top + VisualDeck.cardHeight > windowBottom) {
		hoverImage.css("top", windowBottom - VisualDeck.cardHeight);
	}
	if(hoverImage.offset().left + VisualDeck.cardWidth > windowRight) {
		hoverImage.css("left", el.offset().left - VisualDeck.cardWidth - 30); // additional offset accounts for hoverCard margin
	}
};

/** Handles the event that he card link is moused out of. Removes the image container */
VisualDeck.prototype.onCardLinkOut = function(e) {
	$("#hoverCard").remove();
};

//VisualDeck.prototype.onThumbnailOver = function(e) {
//	var el = $(e.target);
//	el.css("z-index", 1000)
//	  .animate("width", VisualDeck.cardWidth);
//	//el.animate({ width: 200 }, 300);
//};
//
//VisualDeck.prototype.onThumbnailOut = function(e) {
//	var el = $(e.target);
//	//el.css("position", "")
//	//  .css("z-index", "")
//	//  .css("width", VisualDeck.thumbnailWidth);
//	//el.animate({ width: 100 }, 300);
//};

VisualDeck.prototype.addEventHandlers = function() {

	// add link hover event handlers
	$("a.card").each(function(i, link) {
		$(link).mouseover(VisualDeck.onCardLinkOver)
			   .mouseout(VisualDeck.onCardLinkOut);
	});

	// add thumbnail hover event handlers
	//$("img.thumbnail").each(function(i, img) {
	//	$(img).mouseover(VisualDeck.onThumbnailOver)
	//		  .mouseout(VisualDeck.onThumbnailOut);
	//});
};


/************************************************************************************
 * Main
 ************************************************************************************/

/** Parses each post on the page and adds functionality to card tags by replacing the tag text with links or other custom html. */
VisualDeck.prototype.activateCardTags = function(root) {

	var root = root || $("body");
	VisualDeck.replaceTags(VisualDeck.customTags, root);
	VisualDeck.addEventHandlers();
};

// create singleton
VisualDeck = new VisualDeck();

