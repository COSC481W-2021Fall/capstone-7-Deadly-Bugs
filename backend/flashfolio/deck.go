package main

import (
	"context"
	"encoding/json"

	//"fmt"
	"io/ioutil"
	"math/rand"
	"net/http"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Deck struct {
	ID       int    `json:"ID" bson:"id"`
	Title    string `json:"Title" bson:"title"`
	Cards    []Card `json:"Cards" bson:"cards"`
	IsPublic bool   `json:"IsPublic" bson:"ispublic"`
	Owner    string `json:"Owner" bson:"owner"`
}

/*
GetDeck/

returns a deck in it's entirety to the frontend
*/
func GetDeckReq(w http.ResponseWriter, r *http.Request) {
	var deck Deck

	reqBody, err := ioutil.ReadAll(r.Body)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	var req struct {
		ID    int    `json:"ID"`
		Token string `json:"Token"`
	}

	json.Unmarshal(reqBody, &req)

	/* get collection */
	collection := MongoClient.Database("flashfolio").Collection("decks")

	/* set up context for call */
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	err = collection.FindOne(ctx, bson.D{{Key: "id", Value: req.ID}}).Decode(&deck)
	if err != nil {
		// TODO: There has gotta be a better way to do this haha
		// Maybe send a 404 response?
		json.NewEncoder(w).Encode(Deck{-1, "Deck does not exist.", []Card{{"Card Not found", ":("}}, true, ""})
		return
	}

	/* If deck is private check the token */
	if !deck.IsPublic {
		tokenInfo, err := VerifyIdToken(req.Token)
		if err != nil {
			/* Bad Token => Unauthorized */
			w.WriteHeader(http.StatusUnauthorized)
			return
		}
		if tokenInfo.UserId != deck.Owner {
			/* Not owner, ergo forbidden */
			w.WriteHeader(http.StatusForbidden)
			return
		}
	}

	json.NewEncoder(w).Encode(deck)
}

func SaveDeckReq(w http.ResponseWriter, r *http.Request) {

	reqBody, err := ioutil.ReadAll(r.Body)

	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	var req struct {
		Deck  Deck   `json:"Deck"`
		Token string `json:"Token"`
	}

	json.Unmarshal(reqBody, &req)

	tokenInfo, err := VerifyIdToken(req.Token)
	if err != nil {
		/* Bad Token => Unauthorized */
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	collection := MongoClient.Database("flashfolio").Collection("decks")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var realDeck Deck
	err = collection.FindOne(ctx, bson.D{{Key: "id", Value: req.Deck.ID}}).Decode(&realDeck)
	if err != nil {
		/* That deck doesn't exist => 404 */
		w.WriteHeader(http.StatusNotFound)
		return
	}
	if tokenInfo.UserId != realDeck.Owner {
		/* Not the deck owner => Forbidden */
		w.WriteHeader(http.StatusForbidden)
		return
	}

	OverwriteDeck(req.Deck)

	w.WriteHeader(http.StatusOK)
}

func CloneDeckReq(w http.ResponseWriter, r *http.Request) {

	reqBody, err := ioutil.ReadAll(r.Body)

	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	var req struct {
		Deck  Deck   `json:"Deck"`
		Token string `json:"Token"`
	}

	json.Unmarshal(reqBody, &req)

	var ret struct {
		ID int `json:"ID"`
	}

	tokenInfo, err := VerifyIdToken(req.Token)
	if err != nil {
		/* Bad Token => Unauthorized */
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	user, err := GetUserByID(tokenInfo.UserId, ctx)

	ret.ID = CloneDeck(req.Deck, *user)

	user.OwnedDecks = append(user.OwnedDecks, ret.ID)
	w.WriteHeader(http.StatusOK)

	json.NewEncoder(w).Encode(ret)
}

// Saves deck to Database, overwriting existing deck with same id if present.
func OverwriteDeck(deck Deck) {

	// set up collection
	collection := MongoClient.Database("flashfolio").Collection("decks")

	// set up context
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// set up options to create new document if document doesn't exist
	opt := options.Replace().SetUpsert(true)

	// set up filter to locate document with identical user generated ID
	filter := bson.D{{Key: "id", Value: deck.ID}}

	// Replace document within mongo if found.
	collection.ReplaceOne(ctx, filter, deck, opt)
}

// Generates a random integer for use as deck ID
func GenerateID() int {
	// Create new seed for number generation
	rand.Seed(time.Now().UnixNano())
	genID := rand.Intn(99999999)

	// Check collection to guarantee generated ID isn't a duplicate value
	var deck Deck
	collection := MongoClient.Database("flashfolio").Collection("decks")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	filter := bson.D{{Key: "id", Value: genID}}
	err := collection.FindOne(ctx, filter).Decode(&deck)
	if err != nil {

		// didn't find an duplicate ID. return genID
		return genID
	}

	// Duplicate value found. Iterate through values until value isn't a duplicate
	for {
		genID += 1 // <-- Algorithm for security goes here. Yes it's weak right now
		filter = bson.D{{Key: "id", Value: genID}}
		err = collection.FindOne(ctx, filter).Decode(&deck)
		if err != nil {
			break
		}
	}
	return genID
}

// Clones the deck.
func CloneDeck(deck Deck, user User) int {

	// set up collection
	collection := MongoClient.Database("flashfolio").Collection("decks")
	newDeck := deck
	var sameID Deck
	newDeck.Owner = user.ID

	// set up context
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// set up filter to locate document with identical user generated ID
	filter := bson.D{{Key: "id", Value: newDeck.ID}}
	err := collection.FindOne(ctx, filter).Decode(&sameID)
	if err != nil {

		// Error handling. This should never be nil when it first runs.
		collection.InsertOne(ctx, newDeck)
	} else {

		// Duplicate value found. Iterate through values until value isn't a duplicate

		newDeck.ID = GenerateID()

		// insert document when deckID that isn't currently used is found.
		collection.InsertOne(ctx, newDeck)
	}
	return newDeck.ID
}

func CreateNewDeckReq(w http.ResponseWriter, r *http.Request) {

	reqBody, err := ioutil.ReadAll(r.Body)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	var req struct {
		Token    string `json:"Token"`
		DeckName string `json:"DeckName"`
	}

	json.Unmarshal(reqBody, &req)

	var ret struct {
		ID int `json:"ID"`
	}

	tokenInfo, err := VerifyIdToken(req.Token)
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	user, err := GetUserByID(tokenInfo.UserId, ctx)
	if err != nil {
		panic(err)
	}

	newID := GenerateID()

	var newDeck Deck
	newDeck.Cards = []Card{{"", ""}}
	newDeck.ID = newID
	newDeck.Title = req.DeckName
	newDeck.Owner = user.ID
	newDeck.IsPublic = true

	collection := MongoClient.Database("flashfolio").Collection("decks")

	collection.InsertOne(ctx, newDeck)
	user.OwnedDecks = append(user.OwnedDecks, newDeck.ID)
	OverwriteUser(*user, false, ctx)

	ret.ID = newID
	json.NewEncoder(w).Encode(ret)
}

func QueryDecksReq(w http.ResponseWriter, r *http.Request) {
	pageSize := 5
	reqBody, err := ioutil.ReadAll(r.Body)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	var req struct {
		PageNumber int    `json:"PageNumber"`
		Query      string `json:"Query"`
	}

	json.Unmarshal(reqBody, &req)

	var ret struct {
		DeckIDs        []int `json:"DeckIDs"`
		RemainingDecks bool  `json:"RemainingDecks"`
	}

	/* get collection */
	collection := MongoClient.Database("flashfolio").Collection("decks")

	/* set up context for call */
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	/* Find the decks */
	cur, err := collection.Find(ctx, bson.D{{Key: "ispublic", Value: true}})

	defer cur.Close(ctx)
	if err != nil {
		panic(err)
		return
	}

	/* Skip to the correct page */
	for i := 0; i < pageSize*req.PageNumber; i++ {
		cur.Next(ctx)
	}
	ret.RemainingDecks = true
	/* Get the page */
	for i := 0; i < pageSize; i++ {
		ret.RemainingDecks = cur.Next(ctx)
		var deck Deck
		cur.Decode(&deck)
		ret.DeckIDs = append(ret.DeckIDs, deck.ID)
	}
	json.NewEncoder(w).Encode(ret)
}
