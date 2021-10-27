package main

type User struct {
	// TODO: It may eventuall behoove us to implement user IDs.
	Email      string `json:"Email"`

	// List of deckIDs owned by this user
	OwnedDecks []int  `json:"OwnedDecks"`
}
