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
	deck := Deck{10, []Card{{"Changed the front!","Changed the back!"}}, true, "6175d94b13e446a3f0fa7752"}
	overwriteDeck(deck)
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

	err = collection.FindOne(ctx, bson.D{{Key: "ID", Value: req.ID}}).Decode(&deck)
	if err != nil {
		//json.NewEncoder(w).Encode(Deck{-1, []Card{{"Card Not found", ":("}}, true})
		return
	}

	fmt.Println("Got a request for card: ", req.ID)

	json.NewEncoder(w).Encode(deck)
}

func saveDeckToDB(){
	// Create a random number to be used as Deck ID later
	rand.Seed(time.Now().UnixNano())
	genID := rand.Intn(99999999)
	fmt.Print("random numbers generated: ")
	fmt.Println(genID)

	// Set ID to be same for both the deck being created and where it wants to save
	checkID := 10

	// Create Static deck
	fmt.Println("Creating deck...")

	d := Deck{checkID, []Card{{"front","back"}}, true, "6175d94b13e446a3f0fa7752"}


	// Get collection from mongo
	fmt.Println("Getting collection...")
	collection := mongoClient.Database("flashfolio").Collection("decks")

	// Set up context for Mongo
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Check db to make sure there isn't a deck with the same ID
	cDeck := collection.FindOne(ctx, bson.D{{Key: "ID", Value: checkID}})
	if cDeck != nil{
		for {
			checkID += 1
			cDeck = collection.FindOne(ctx, bson.D{{Key: "ID", Value: checkID}})
			if cDeck == nil {
				break
			}
		}
	}

	// Insert to the collection
	fmt.Println("Inserting deck...")
	collection.InsertOne(ctx, d)
}

func overwriteDeck(deck Deck){
	fmt.Println("UPDATED: Attempting to overwrite deck...")
	fmt.Println("Deck ID for testing is 10")

	collection := mongoClient.Database("flashfolio").Collection("decks")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	opt := options.Replace().SetUpsert(true)
	filter := bson.D{{Key: "_id", Value: deck.Mid}}

	collection.ReplaceOne(ctx, filter, deck, opt)
}