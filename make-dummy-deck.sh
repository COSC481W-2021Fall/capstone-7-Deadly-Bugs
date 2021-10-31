#!/bin/bash

# 
# This script makes generating dummy decks for your mongoDB fun and easy!!
# 
# first run:
# 	chmod +x make-dummy-deck.sh
# and then:
# 	./make-dummy-deck.sh
# 

echo "Enter ID of new deck to insert:"
read deckID

echo "Enter number of cards to be inside deck:"
read numCards

echo "
let cardArr = [];

for (let i = 0; i < $numCards; i++) {
	cardArr.push({'FrontSide' : 'This is card '+i+'!', 'BackSide': 'This is the back of card '+i+'!!'});
}

db.decks.insertOne({'ID' : $deckID, 'Title': 'This is the deck title', 'Cards': cardArr, 'IsPublic':true})

printjson(db.decks.find({'ID' : $deckID}));
" >> dummyTemp.js

mongosh flashfolio dummyTemp.js

rm dummyTemp.js

