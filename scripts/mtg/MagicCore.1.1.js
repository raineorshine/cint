// TODO: Store cards in a dictionary indexed by cardName.

/** @file Contains core classes like Deck and Card for all the Deck Tools components. 
Deck
	fromCardNames (static)
	fromCards (static)
	index
	flatten
	draw
	evaluate
	has
	hasAtLeast
	hasRange
	chunk
	size
	similarity

*/

/** @class A deck of cards. */
// OPTIMIZATION: maintain sorted array to speed searching
var Deck = function(input) {
	var mode = "nonland";
	this.cards = input ? input.split(/<br>|\n|\|/)
		.filter(hasValue) // filter out empty lines
		.map(function(line) { 
			if(line.match(/\/\/\W*land/)) {
				mode = "land";
				return null; // return a value that will be filtered out of the final list
			}
			else {
				var card = new Card(line);
				if(mode == "land") {
					card.cardType = "land";
				}
				return card; 
			}
		})
		.filter(hasValue) : []; // filter out comments
};

/** Creates a deck from a list of card names. 
	@static
*/
Deck.fromCardNames = function(cardNames) {

	var deck = new Deck();

	// build a dictionary of {cardName: count}
	deck.cardDict = {};
	for(var i=0; i<cardNames.length; i++) {
		var count = deck.cardDict[cardNames[i]] || 0;
		deck.cardDict[cardNames[i]] = count + 1;
	}

	// also build a list of cards
	for(var name in deck.cardDict) {
		var card = new Card();
		card.name = name;
		card.count = deck.cardDict[name];
		deck.cards.push(card);
	}

	return deck;
};

/** Creates a deck from a list of cards. 
	@static
*/
Deck.fromCards = function(cards) {

	var deck = new Deck();
	deck.cards = cards;

	// build a dictionary of {card name: count}
	deck.cardDict = {};
	for(var i=0; i<cards.length; i++) {
		var count = deck.cardDict[cards[i].name] || 0;
		deck.cardDict[cards[i].name] = count + 1;
	}

	return deck;
};

/** Creates a deck from JSON data returned from the database, which may require some messaging.
	@static
*/
Deck.fromJsonCards = function(cards) {

	var deck = new Deck();
	deck.cards = cards.map(Card.fromJsonCard);

	return deck;
};

/** Returns a dictionary of all the cards indexed by cardName. */
Deck.prototype.dict = function() {
	var cardDict = {};
	each(this.cards, function(card) {
		cardDict[card.name] = card;
	});
	return cardDict;
}

/** Returns the card at the given index, or null if the index is invalid. */
Deck.prototype.index = function(cardIndex) {
	var count = 0;
	for(var i=0; i<this.cards.length; i++) {
		if(cardIndex < count + this.cards[i].count) {
			return this.cards[i];
		}
		else {
			count += this.cards[i].count;
		}
	}

	return null;
};

/** Returns the deck as a list of card names (with multiple entries for more than 1 of a card). */
Deck.prototype.flatten = function() {
	var cardNames = [];
	for(var i=0; i<this.cards.length; i++) {
		for(var j=0; j<this.cards[i].count; j++) {
			cardNames.push(this.cards[i].name);
		}
	}
	return cardNames;
};

/** Returns a list of n cards drawn randomly without replacement from the deck. 
	@param n	Default: 7.
*/
Deck.prototype.draw = function(n) {
	if(n === undefined) n = 7;
	var that = this;
	var taken = [];
	var cardNames = this.flatten();

	// fill the taken array with a list of indices
	// reroll if the card has already been taken
	while(taken.length < n) {
		var rand = Math.floor(Math.random() * cardNames.length);
		if(!inArray(taken, rand)) {
			taken.push(rand);
		}
	}

	return taken.map(this.index, this);
};

/** Parses the expression, replacing terms like "1 Mountain" with callable instructions like 'this.has(1, "Mountain")'. 
	Substitutes all the aliases in the expression.
	Evals the parsed boolean expression and returns the result.
*/
Deck.prototype.evaluate = function(expression, aliases) {
	aliases = aliases || [];
	var reHas = 	/(\d) "([^"]*?)"/g;
	var reAtLeast = /(\d)\+ "([^"]*?)"/g;
	var reRange = 	/(\d)-(\d) "([^"]*?)"/g;

	// substitute aliases
	aliases.forEach(function(alias) {
		expression = expression.replace(alias.name, alias.cardNames);
	});

	// replace card names with callable boolean functions
	expression = expression
		.replace(reRange, 	"this.hasRange($1, $2, \"$3\")")
		.replace(reAtLeast, "this.hasAtLeast($1\, \"$2\")")
		.replace(reHas, 	"this.has($1, \"$2\")");

	return eval(expression);
};

/** Returns true if the deck has exactly *count* cards with the given comma-delimited list of card names. */
Deck.prototype.has = function(count, namesInput) {
	return this.hasRange(count, count, namesInput);
};

/** Returns true if the deck has at least *count* cards with the given comma-delimited list of card names. */
Deck.prototype.hasAtLeast = function(count, namesInput) {
	return this.hasRange(count, 1000, namesInput);
};

/** Returns true if the deck has *min* to *max* (inclusive) cards with the given comma-delimited list of card names. 
	OPTIMIZATION: maintain sorted array to speed searching
*/
Deck.prototype.hasRange = function(min, max, namesInput) {
	var names = namesInput.split(/\s*,\s*/);
	var count = 0;

	for(var i=0; i<names.length; i++) {
		var name = names[i];
		if(this.cardDict[name]) {
			count += this.cardDict[name];
			if(count > max) {
				return false;
			}
		}
	}

	// old, slow method using this.cards instead of the dictionary
	//for(var i=0; i<this.cards.length; i++) {
	//	if(inArray(names, this.cards[i].name)) {
	//		count += this.cards[i].count;
	//		if(count > max) {
	//			return false;
	//		}
	//	}
	//}
	return count >= min;
};

/** Returns a new Deck with the same cards but individual entries with count > the given max count are broken into separate card entries. Useful before creating a visual display that doesn't want stacks too large. */
Deck.prototype.chunk = function(maxCount) {
	var chunkedCards = [];
	each(this.cards, function(card) {

		// max stacks
		if(card.count >= maxCount) {
			for(var i=0; i<card.count/maxCount; i++) {
				var newCard = new Card();
				newCard.name = card.name;
				newCard.count = maxCount;
				chunkedCards.push(newCard);
			}
		}

		// normal stack
		var newCard = new Card();
		newCard.name = card.name;
		newCard.count = card.count % maxCount;
		chunkedCards.push(newCard);
	});

	return Deck.fromCards(chunkedCards);
};

Deck.prototype.size = function() {
	var sumCount = function(result, card) { return result + card.count; };
	return reduce(sumCount, 0, this.cards);
};

/** Returns a number between 0 and 1 of how similar the given deck is to this deck. */
Deck.prototype.similarity = function(deck) {
	var thisDict = this.dict();
	var deckDict = deck.dict();
	var similarCount = 0;

	for(var cardName in thisDict) {
		similarCount += deckDict[cardName] ?
			Math.min(thisDict[cardName].count, deckDict[cardName].count) :
			0;
	}
	return similarCount / Math.max(this.size(), deck.size());
};

/*****************************************************************/

/** @class A card.
	@param line		The line of text from which the card is parsed.
*/
var Card = function(line) {
	if(line) {
		var space = line.indexOf(" ");
		this.count = parseInt(line.substring(0, space));
		this.name = line.substring(space+1);
	}
};

/** Creates HTML that represents the card that can be inserted into the DOM. */
Card.prototype.create = function() {
	var className = "card";
	if(this.cardType !== undefined) {
		className = className + " " + this.cardType;
	}
	return "<div class=\"{0}\">{1}</div>".format(className, this.name);
};

/** Returns whether the card is a creature, non-creature spell ("spell"), or land. */
Card.prototype.roughType = function() {
	var supertype = this.supertype.toLowerCase()
	//supertype.indexOf("creature") >= 0 ? "creature" :
	return supertype.indexOf("land") >= 0 ? "land" : "spell";
};

/** A compare function that can be passed to Array.sort when sorting an array of cards. 
 * Sorts by cmc => color => mana cost => supertype => count => name
 * */
Card.prototype.compareCastingCost = function(a,b) {
	return dynamicCompare([
		"cmc",
		"manacost", 
		"color", 
		"supertype", 
		"count DESC", 
		"name"
	])(a,b);
}

Card.fromJsonCard = function(card) {
	var newCard = new Card();
	newCard.name =			card.name;
	newCard.nameEncrypted = card.nameEncrypted;
	newCard.supertype =		card.supertype;
	newCard.subtype =		card.subtype;
	newCard.subtype =		card.subtype;
	newCard.cmc =			card.cmc === 0 || card.cmc ? parseInt(card.cmc) : null;
	newCard.color =			card.color;
	newCard.power =			card.power;
	newCard.toughness =		card.toughness;
	newCard.loyalty =		card.loyalty;
	newCard.rarity =		card.rarity;
	newCard.setcode =		card.setcode;
	newCard.setnumber =		card.setnumber;
	newCard.text =			card.text;
	newCard.count =			parseInt(card.count);
	newCard.maindeck =		card.maindeck == "1";
	return newCard;
}

/*****************************************************************/

/** @class A name that can be substituted for several cards. */
var Alias = function(line) {
	var parts = line.split(/\s*=\s*/);
	this.name = parts[0];
	this.cardNames = parts[1].split(/\s*,\s*/);
};

/*****************************************************************/

/** Calculates how many combinations of r cards (order doesn't matter) that can be selected from n cards. */
var choose = function(n,r) {
	return fact(n) / (fact(r) * fact(n-r));
};

/** Recursive factorial. */
var fact = function(n) {
	if(n < 0) {
		throw new Error("Cannot take a factorial of a number less than 0.");
	}
	else if(n == 0) {
		return 1;
	}
	else {
		return n * fact(n-1); // RECURSION
	}
}

// N, Z, X, Y
var hyper = function(targetNumber, numberOfDraws, numberInDeck, totalCardsInDeck) {
	return choose(numberInDeck, targetNumber) * choose(totalCardsInDeck - numberInDeck, numberOfDraws - targetNumber) / choose(totalCardsInDeck, numberOfDraws);
};
