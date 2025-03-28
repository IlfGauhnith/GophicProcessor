package mq

import (
	"os"

	_ "github.com/IlfGauhnith/GophicProcessor/pkg/config"
	logger "github.com/IlfGauhnith/GophicProcessor/pkg/logger"
	"github.com/streadway/amqp"
)

var rabbitConn *amqp.Connection
var publishChannel *amqp.Channel
var consumeChannel *amqp.Channel

func init() {
	var err error
	rabbitConn, err = amqp.Dial(os.Getenv("RABBITMQ_URL"))
	if err != nil {
		logger.Log.Fatalf("Failed to connect to RabbitMQ: %v", err)
	}

	// Separate channel for publishing
	publishChannel, err = rabbitConn.Channel()
	if err != nil {
		logger.Log.Fatalf("Failed to open publish channel: %v", err)
	}

	// Separate channel for consuming
	consumeChannel, err = rabbitConn.Channel()
	if err != nil {
		logger.Log.Fatalf("Failed to open consume channel: %v", err)
	}

	// Declare the queue at startup
	_, err = publishChannel.QueueDeclare(
		"image_resize", // queue name
		true,           // durable
		false,          // delete when unused
		false,          // exclusive
		false,          // no-wait
		nil,            // arguments
	)
	if err != nil {
		logger.Log.Fatalf("Failed to declare queue: %v", err)
	}

	logger.Log.Println("Queue 'image_resize' declared successfully")
}

func GetPublishChannel() *amqp.Channel {
	return publishChannel
}

func GetConsumeChannel() *amqp.Channel {
	return consumeChannel
}

func CloseRabbitMQ() {
	logger.Log.Info("Closing RabbitMQ connection...")

	if publishChannel != nil {
		publishChannel.Close()
	}
	if consumeChannel != nil {
		consumeChannel.Close()
	}
	if rabbitConn != nil {
		rabbitConn.Close()
	}

	logger.Log.Info("RabbitMQ connection closed")
}
