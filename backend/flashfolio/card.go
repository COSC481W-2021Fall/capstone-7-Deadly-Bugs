package main

type Card struct {
	FrontSide string `json:"FrontSide" bson:"frontside"`
	BackSide  string `json:"BackSide" bson:"backside"`
}
