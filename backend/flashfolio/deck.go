package main

type Deck struct {
	ID       int    `json:"ID" bson:"id"`
	Title    string `json:"Title" bson:"title"`
	Cards    []Card `json:"Cards" bson:"cards"`
	IsPublic bool   `json:"IsPublic" bson:"ispublic"`
	Owner    string `json:"Owner" bson:"owner"`
}
