package main

import (
	"encoding/json"
	"fmt"
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"io/ioutil"
	"log"
	"math/rand"
	"net/http"

//	"strconv"

	"context"
	"time"


	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
)

const MongoURI string = "mongodb://localhost:27017/"

var mongoClient *mongo.Client

func main() {

	fmt.Println("Starting flashfolio back end...")

	fmt.Println("Connecting to MongoDB...")

	/* Create contenxt for initial mongo connection*/
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	/* Connect to mongo */
	var err error
	mongoClient, err = mongo.Connect(ctx, options.Client().ApplyURI(MongoURI))
	if err != nil {
		panic(err)
	}

	/* Safely disconnect from Mongo once server is shut down */
	defer func() {
		if err = mongoClient.Disconnect(ctx); err != nil {
			panic(err)
		}
	}()

	/* Ping Mongo to test connection */
	if err := mongoClient.Ping(ctx, readpref.Primary()); err != nil {
		panic(err)
	}

	fmt.Println("Successfully connected to MongoDB")

	//*******************************************************************
	//*** THIS METHOD IS FOR TESTING OVERWRITING DECK WITHIN DATABASE ***

	/*
	deck := Deck{1,
		[]Card{{
			"Can This change?",
			"can this change?"}},
		true}
	overwriteDeck(deck)
	*/

	//*******************************************************************

	handleRequests()
}

/*
handleRequests

Creates the backend HTTP server & sets up CORS & routing.
*/
func handleRequests() {
	router := mux.NewRouter().StrictSlash(true)

	router.HandleFunc("/getDeck", getDeckReq)
	router.HandleFunc("/saveDeck", saveDeckReq)

	log.Fatal(http.ListenAndServe(":1337",
		handlers.CORS(
			handlers.AllowedHeaders([]string{"X-Requested-With", "Content-Type", "Authorization"}),
			handlers.AllowedMethods([]string{"GET", "POST", "PUT", "HEAD", "OPTIONS"}),
			handlers.AllowedOrigins([]string{"*"}))(router)))
}


/*
getDeck/

returns a deck in it's entirety to the frontend
*/
func getDeckReq(w http.ResponseWriter, r *http.Request) {
	var deck Deck

	reqBody, err := ioutil.ReadAll(r.Body)
	if err != nil {
		panic(err)
	}

	var req struct {
		ID int `json:"ID"`
	}

	json.Unmarshal(reqBody, &req)

	/* get collection */
	collection := mongoClient.Database("flashfolio").Collection("decks")

	/* set up context for call */
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	err = collection.FindOne(ctx, bson.D{{Key: "id", Value: req.ID}}).Decode(&deck)
	if err != nil {
		//json.NewEncoder(w).Encode(Deck{-1, []Card{{"Card Not found", ":("}}, true})
		return
	}

	fmt.Println("Got a request for card: ", req.ID)

	json.NewEncoder(w).Encode(deck)
}

func saveDeckReq(w http.ResponseWriter, r *http.Request) {

	reqBody, err := ioutil.ReadAll(r.Body)

	if err != nil {
		panic(err)
	}

	var req struct {
		Deck Deck `json:"Deck"`
	}

	json.Unmarshal(reqBody, &req)

	fmt.Println(string(reqBody))
	fmt.Println("Got save req for", req)

	overwriteDeck(req.Deck)

	w.WriteHeader(http.StatusOK)
}


// Generates a random integer for use as deck ID
func generateID() int {
	// Create new seed for number generation
	rand.Seed(time.Now().UnixNano())
	genID := rand.Intn(99999999)

	// Check collection to guarantee generated ID isn't a duplicate value
	collection := mongoClient.Database("flashfolio").Collection("decks")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	filter := bson.D{{Key: "id", Value: genID}}
	err := collection.FindOne(ctx, filter)
	if err != nil {

		// didn't find an duplicate ID. return genID
		fmt.Print("generated ID: ")
		fmt.Println(genID)
		return genID
	} else {

		// Duplicate value found. Iterate through values until value isn't a duplicate
		for true {
			genID += 1
			filter = bson.D{{Key: "id", Value: genID}}
			err = collection.FindOne(ctx, filter)
			if err != nil {
				break
			}
		}
	}
	fmt.Print("generated ID: ")
	fmt.Println(genID)
	return genID
}

// Saves deck to Database, overwriting existing deck with same id if present.
func overwriteDeck(deck Deck){

	// set up collection
	collection := mongoClient.Database("flashfolio").Collection("decks")

	// set up context
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// set up options to create new document if document doesn't exist
	//opt := options.Replace().SetUpsert(true)

	// set up filter to locate document with identical user generated ID
	filter := bson.D{{Key: "id", Value: deck.ID}}

	// Replace document within mongo if found.
	collection.ReplaceOne(ctx, filter, deck)
}
