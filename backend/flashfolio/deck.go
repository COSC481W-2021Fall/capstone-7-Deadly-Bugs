package main

type Deck struct {
	ID       int    `json:"ID" bson:"id"`
	Cards    []Card `json:"Cards" bson:"cards"`
	IsPublic bool   `json:"IsPublic" bson:"ispublic"`
}
