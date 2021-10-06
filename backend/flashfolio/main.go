package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"

	"context"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
)

const mongoURI string = "mongodb://localhost:27017/"

var mongoClient *mongo.Client

func main() {

	fmt.Println("Starting flashfolio back end...")

	fmt.Println("Connecting to MongoDB...")

	/* Create contenxt for initial mongo connection*/
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	/* Connect to mongo */
	var err error
	mongoClient, err = mongo.Connect(ctx, options.Client().ApplyURI(mongoURI))
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
		json.NewEncoder(w).Encode(Deck{-1, []Card{{"Card Not found", ":("}}, true})
		return
	}

	fmt.Println("Got a request for card: ", req.ID)

	json.NewEncoder(w).Encode(deck)
}
