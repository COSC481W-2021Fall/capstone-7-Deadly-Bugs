package main;

type Deck struct {
	ID        int    `json:"ID"`
	Cards	  []Card `json:"Cards"`
	isPublic  bool 	 `json:"isPublic"`
}