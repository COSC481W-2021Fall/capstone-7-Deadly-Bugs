package main

import (
	"fmt"
	"log"
	"net/http"
	"encoding/json"
	"io/ioutil"
	"github.com/gorilla/mux"
	"github.com/gorilla/handlers"

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

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var err error
	mongoClient, err = mongo.Connect(ctx, options.Client().ApplyURI(mongoURI))
	if err != nil {
		panic(err)
	}

	defer func() {
		if err = mongoClient.Disconnect(ctx); err != nil {
			panic(err)
		}
	}()

	if err := mongoClient.Ping(ctx, readpref.Primary()); err != nil {
		panic(err)
	}

	fmt.Println("Successfully connected to MongoDB")

	handleRequests()

}

func handleRequests() {
	router := mux.NewRouter().StrictSlash(true)

	router.HandleFunc("/getDeck", getDeckReq)

	log.Fatal(http.ListenAndServe(":1337",
		handlers.CORS(
		handlers.AllowedHeaders([]string{"X-Requested-With", "Content-Type", "Authorization"}),
		handlers.AllowedMethods([]string{"GET", "POST", "PUT", "HEAD", "OPTIONS"}),
		handlers.AllowedOrigins([]string{"*"}))(router)))

}


func getDeckReq(w http.ResponseWriter, r *http.Request) {

	// TODO: Switch to Deck upon implementation
	var deck Card

	reqBody, err := ioutil.ReadAll(r.Body)
	if err != nil {
		panic(err)
	}

	var req struct {
		ID int `json:"ID"`
	}

	json.Unmarshal(reqBody, &req)

	// get collection
	// TODO: Switch collection to "decks" upon implementing decks.
	collection := mongoClient.Database("flashfolio").Collection("cards")

	// set up context for call
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	err = collection.FindOne(ctx, bson.D{{"ID", req.ID}}).Decode(&deck)
	if err != nil {
		json.NewEncoder(w).Encode(Card{-1, "Card Not found", ":("})
		return
	}

	fmt.Println("Got a request for card: ", req.ID)

	json.NewEncoder(w).Encode(deck)
}




