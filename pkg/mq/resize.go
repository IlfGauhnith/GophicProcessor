package mq

import (
	"fmt"

	_ "github.com/IlfGauhnith/GophicProcessor/pkg/config"

	"encoding/json"

	logger "github.com/IlfGauhnith/GophicProcessor/pkg/logger"

	model "github.com/IlfGauhnith/GophicProcessor/pkg/model"
	"github.com/streadway/amqp"
)

func PublishResizeJob(resizeJob model.ResizeJob) error {
	logger.Log.Info("PublishResizeJob")

	ch := GetPublishChannel()
	if ch == nil {
		logger.Log.Fatalf("RabbitMQ channel is not available")
		return fmt.Errorf("rabbitmq channel not available")
	}

	body, err := json.Marshal(resizeJob)
	if err != nil {
		logger.Log.Fatalf("Failed to marshal resizeJob: %v", err)
		return err
	}

	err = ch.Publish(
		"",             // exchange
		"image_resize", // routing key (queue name)
		false,          // mandatory
		false,          // immediate
		amqp.Publishing{
			ContentType: "application/json",
			Body:        body,
		},
	)
	if err != nil {
		logger.Log.Fatalf("Failed to publish message: %v", err)
	}

	logger.Log.Infof("Job published to rabbitmq: %s", resizeJob.JobID)
	return err
}

func ConsumeResizeJobs(jobs chan<- model.ResizeJob) {
	logger.Log.Info("ConsumeResizeJobs")

	ch := GetConsumeChannel()
	if ch == nil {
		logger.Log.Fatalf("RabbitMQ channel is not available")
		return
	}

	msgs, err := ch.Consume(
		"image_resize", // queue name
		"",             // consumer tag
		true,           // auto-ack
		false,          // exclusive
		false,          // no-local
		false,          // no-wait
		nil,            // arguments
	)
	if err != nil {
		logger.Log.Fatalf("Failed to register a consumer: %v", err)
	}

	// Continuously listens to the message channel (msgs) provided by the RabbitMQ library.
	// When a new message is received, it is decoded into a model.ResizeJob struct.
	// The job is then sent to the worker pool via the jobs channel.
	// The for msg := range msgs loop will block and wait if the channel is empty.
	for msg := range msgs {
		var job model.ResizeJob
		if err := json.Unmarshal(msg.Body, &job); err != nil {
			logger.Log.Warnf("Failed to decode message: %v", err)
			continue
		}
		logger.Log.Infof("Consuming job from rabbitmq: %s", job.JobID)

		jobs <- job
		logger.Log.Infof("Job sent to worker: %s", job.JobID)
	}
}
