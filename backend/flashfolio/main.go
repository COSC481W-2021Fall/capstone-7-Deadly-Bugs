package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"

	"context"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"

	"google.golang.org/api/oauth2/v2"
)

const MongoURI string = "mongodb://localhost:27017/"

var MongoClient *mongo.Client

var DeckCollection *mongo.Collection
var UserCollection *mongo.Collection

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
		log.Fatal(err)
	}

	/* Safely disconnect from Mongo once server is shut down */
	defer func() {
		if err = MongoClient.Disconnect(ctx); err != nil {
			log.Fatal(err)
		}
	}()

	/* Ping Mongo to test connection */
	if err := MongoClient.Ping(ctx, readpref.Primary()); err != nil {
		log.Fatal(err)
	}

	fmt.Println("Successfully connected to MongoDB")

	/* Create Pointers to Mongo Collections */
	DeckCollection = MongoClient.Database("flashfolio").Collection("decks")
	UserCollection = MongoClient.Database("flashfolio").Collection("users")

	handleRequests()
}

/*
handleRequests

Creates the backend HTTP server & sets up CORS & routing.
*/
func handleRequests() {
	router := mux.NewRouter().StrictSlash(true)

	router.HandleFunc("/getDeck", GetDeckReq)

	router.HandleFunc("/createNewDeck", CreateNewDeckReq)

	router.HandleFunc("/saveDeck", SaveDeckReq)
	router.HandleFunc("/cloneDeck", CloneDeckReq)

	router.HandleFunc("/userLogin", UserLoginReq)
	router.HandleFunc("/getUser", GetUserReq)

	router.HandleFunc("/queryDecks", QueryDecksReq)
	router.HandleFunc("/deleteDeck", DeleteDeckReq)

	log.Fatal(http.ListenAndServe(":1337",
		handlers.CORS(
			handlers.AllowedHeaders([]string{"X-Requested-With", "Content-Type", "Authorization"}),
			handlers.AllowedMethods([]string{"GET", "POST", "PUT", "HEAD", "OPTIONS"}),
			handlers.AllowedOrigins([]string{"*"}))(router)))
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
