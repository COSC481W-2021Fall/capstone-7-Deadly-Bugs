package main

type Deck struct {
	ID       int    `json:"ID"`
	Cards    []Card `json:"Cards"`
	IsPublic bool   `json:"IsPublic"`
	Owner    string `json:"Owner"`
}
