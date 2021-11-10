package main

import (
	"context"

	"encoding/json"
	"fmt"
	"io/ioutil"
//	"log"
//	"math/rand"
	"net/http"

	"time"

	"go.mongodb.org/mongo-driver/bson"
)

type User struct {
	ID         int    `json:"ID" bson:"id"`
	Email      string `json:"Email" bson:"email"`
	// List of deckIDs owned by this user
	OwnedDecks []int  `json:"OwnedDecks" bson:"owneddecks"`
}

func GetUserByEmail(email string, ctx context.Context) (*User, error) {

	var user User

	collection := MongoClient.Database("flashfolio").Collection("users")

	err := collection.FindOne(ctx, bson.D{{Key: "email", Value: email}}).Decode(&user)

	if err != nil {
		return nil, err
	}

	return &user, nil
}

func GetUserByID(id int, ctx context.Context) (*User, error) {
	var user User

	collection := MongoClient.Database("flashfolio").Collection("users")

	err := collection.FindOne(ctx, bson.D{{Key: "id", Value: id}}).Decode(&user)
	if err != nil {
		return nil, err
	}

	return &user, nil
}

/*
generateNewUserID()

For generating new user IDs.
*/
func generateNewUserID() int {
	return 10000;
}

/*
UserLoginReq

Called whenever a user logs in. This gives us a chance to add the user to the
database, assuming that they are not already in the database. This would also
be the place to put any logic we want to execute when a user logs in.
*/
func UserLoginReq(w http.ResponseWriter, r *http.Request) {
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
		fmt.Println(err)
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	collection := MongoClient.Database("flashfolio").Collection("users")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	_, err = GetUserByEmail(tokenInfo.Email, ctx)
	if err != nil {
		var newUser User
		newUser.ID = generateNewUserID();
		newUser.Email = tokenInfo.Email
		collection.InsertOne(ctx, newUser)
	}

}

