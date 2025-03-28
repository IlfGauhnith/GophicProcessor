package util

import (
	"os"
	"os/signal"
	"syscall"

	_ "github.com/IlfGauhnith/GophicProcessor/pkg/config"
	db "github.com/IlfGauhnith/GophicProcessor/pkg/db"
	logger "github.com/IlfGauhnith/GophicProcessor/pkg/logger"
	"github.com/IlfGauhnith/GophicProcessor/pkg/mq"
)

func WaitForShutdown() {
	shutdown := make(chan os.Signal, 1)
	signal.Notify(shutdown, syscall.SIGINT, syscall.SIGTERM)

	// Block until a signal is received
	sig := <-shutdown
	logger.Log.Infof("Received signal: %s, shutting down...", sig)

	// Perform RabbitMQ cleanup
	mq.CloseRabbitMQ()

	// Perform DB cleanup
	db.CloseDB()

	logger.Log.Infof("Cleanup completed, exiting...")
	os.Exit(0)
}
