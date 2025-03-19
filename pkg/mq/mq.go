package mq

import (
	"log"

	"github.com/streadway/amqp"
)

// Connect returns a RabbitMQ connection.
func Connect(url string) *amqp.Connection {
	conn, err := amqp.Dial(url)
	if err != nil {
		log.Fatalf("Failed to connect to RabbitMQ: %v", err)
	}
	return conn
}
