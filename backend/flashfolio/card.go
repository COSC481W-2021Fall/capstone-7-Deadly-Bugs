package main;

type Card struct {
	// TODO: Remove ID upon implementation of decks
	ID        int    `json:"ID"`
	FrontSide string `json:"FrontSide"`
	BackSide  string `json:"BackSide"`
}
