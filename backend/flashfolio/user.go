package main

import (
	"context"

	"go.mongodb.org/mongo-driver/bson"
)

type User struct {
	// TODO: It may eventuall behoove us to implement user IDs.
	Email      string `json:"Email"`

	// List of deckIDs owned by this user
	OwnedDecks []int  `json:"OwnedDecks"`
}

func GetUserByEmail(email string, ctx context.Context) (*User, error) {

	var user User

	collection := MongoClient.Database("flashfolio").Collection("users")

	err := collection.FindOne(ctx, bson.D{{Key: "Email", Value: email}}).Decode(&user)

	if err != nil {
		return nil, err
	}

	return &user, nil
}

