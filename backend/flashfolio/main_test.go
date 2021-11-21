package main

import (
	"testing"

	"context"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
)

/*
Test that you can properly connect to MongoDB and ping it, and disconnect.

This isn't really a great thing to test like this -- but it will do for now.
We may wish to consider dropping this test.
*/
func TestMongoConnection(t *testing.T) {

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	cli, err := mongo.Connect(ctx, options.Client().ApplyURI(MongoURI))
	if err != nil {
		t.Fatal(err)
	}

	/* Safely disconnect from Mongo once server is shut down */
	defer func() {
		if err = cli.Disconnect(ctx); err != nil {
			t.Fatal(err)
		}
	}()

	/* Ping Mongo to test connection */
	if err := cli.Ping(ctx, readpref.Primary()); err != nil {
		t.Fatal(err)
	}
}
