package main

import (
	"fmt"
	"log"
	"net/http"
	"encoding/json"
//	"io/ioutil"
	"github.com/gorilla/mux"
	"github.com/gorilla/handlers"

	"context"
	"time"

//	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
)

const mongoURI string = "mongodb://localhost:27017/"

var mongoClient *mongo.Client

func main() {

	fmt.Println("Starting flashfolio back end...")

	connectToMongo()

	handleRequests()

}


func connectToMongo() {

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
	tc := Card{"This is the front :)", "This is the back :("}

	json.NewEncoder(w).Encode(tc)
}




