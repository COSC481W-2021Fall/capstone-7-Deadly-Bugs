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
	cardArr.push({'frontside' : 'This is card '+i+'!', 'backside': 'This is the back of card '+i+'!!'});
}

db.decks.insertOne({'id' : $deckID, 'title': 'This is the deck title', 'cards': cardArr, 'ispublic':true})

printjson(db.decks.find({'id' : $deckID}));
" >> dummyTemp.js

mongosh flashfolio dummyTemp.js

rm dummyTemp.js

