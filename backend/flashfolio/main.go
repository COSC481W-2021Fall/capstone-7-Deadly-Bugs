package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"math/rand"
	"net/http"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"

	"context"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"

	"google.golang.org/api/oauth2/v2"
)

const MongoURI string = "mongodb://localhost:27017/"

var MongoClient *mongo.Client

func main() {

	fmt.Println("Starting flashfolio back end...")

	fmt.Println("Connecting to MongoDB...")

	/* Create contenxt for initial mongo connection*/
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	/* Connect to mongo */
	var err error
	MongoClient, err = mongo.Connect(ctx, options.Client().ApplyURI(MongoURI))
	if err != nil {
		panic(err)
	}

	/* Safely disconnect from Mongo once server is shut down */
	defer func() {
		if err = MongoClient.Disconnect(ctx); err != nil {
			panic(err)
		}
	}()

	/* Ping Mongo to test connection */
	if err := MongoClient.Ping(ctx, readpref.Primary()); err != nil {
		panic(err)
	}

	fmt.Println("Successfully connected to MongoDB")

	/********************************************************************
	//*** THIS METHOD IS FOR TESTING OVERWRITING DECK WITHIN DATABASE ***

	deck := Deck{10,
		"TestDeck",
		[]Card{{
			"ch-ch-changes.",
			"Is this strange?"}},
		true,
		"Alex"}
	overwriteDeck(deck)

	//*******************************************************************/

	handleRequests()
}

/*
handleRequests

Creates the backend HTTP server & sets up CORS & routing.
*/
func handleRequests() {
	router := mux.NewRouter().StrictSlash(true)

	router.HandleFunc("/getDeck", getDeckReq)

	router.HandleFunc("/getSecret", getSecretReq)
	router.HandleFunc("/createNewDeck", createNewDeckReq)

	router.HandleFunc("/saveDeck", saveDeckReq)

	router.HandleFunc("/userLogin", UserLoginReq)
	router.HandleFunc("/getUser", GetUserReq)

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

// Saves deck to Database, overwriting existing deck with same id if present.
func overwriteDeck(deck Deck) {

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
func generateID() int {
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
		fmt.Println("No dupelicate value found.")
		fmt.Print("generated ID: ")
		fmt.Println(genID)
		return genID
	}

	// Duplicate value found. Iterate through values until value isn't a duplicate
	fmt.Println("Dupelicate value found. finding empty value")
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

/*
VerifyIdToken

Verifies that a google ID token is genuine & returns token/User info

Tokeninfo Struct found here: https://github.com/googleapis/google-api-go-client/blob/2447556ecdd4aae37b4cff8c46fc88a25036e7a1/oauth2/v2/oauth2-gen.go#L182

*/
func VerifyIdToken(idToken string) (*oauth2.Tokeninfo, error) {
	httpClient := http.Client{}
	oauth2Service, err := oauth2.New(&httpClient)
	tokenInfoCall := oauth2Service.Tokeninfo()
	tokenInfoCall.IdToken(idToken)
	tokenInfo, err := tokenInfoCall.Do()

	if err != nil {
		return nil, err
	}

	return tokenInfo, nil
}

func getSecretReq(w http.ResponseWriter, r *http.Request) {

	reqBody, err := ioutil.ReadAll(r.Body)
	if err != nil {
		panic(err)
	}

	var req struct {
		Token string `json:"Token"`
	}

	json.Unmarshal(reqBody, &req)

	tokenInfo, err := VerifyIdToken(req.Token)

	if err != nil {
		panic(err)
	}

	fmt.Println(tokenInfo)

	var ret struct {
		Secret string `json:"Secret"`
	}

	ret.Secret = "It's a secret to everybody. Actually this seceret is for " + tokenInfo.Email

	fmt.Println("Got a req for the secret!")

	json.NewEncoder(w).Encode(ret)
}

func createNewDeckReq(w http.ResponseWriter, r *http.Request) {

	reqBody, err := ioutil.ReadAll(r.Body)
	if err != nil {
		panic(err)
	}

	var req struct {
		Token string `json:"Token"`
		DeckName string `json:"DeckName"`
	}

	json.Unmarshal(reqBody, &req)

	var ret struct {
		ID int `json:"ID"`
	}

	tokenInfo, err := VerifyIdToken(req.Token)
	if err != nil {
		fmt.Println(err)
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	newID := generateID()

	fmt.Println("Creating new deck @", newID)

	var newDeck Deck
	newDeck.Cards = []Card{{"", ""}}
	newDeck.ID = newID
	newDeck.Title = req.DeckName
	newDeck.Owner = tokenInfo.Email
	newDeck.IsPublic = true

	collection := MongoClient.Database("flashfolio").Collection("decks")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	collection.InsertOne(ctx, newDeck)

	ret.ID = newID
	json.NewEncoder(w).Encode(ret)
}


