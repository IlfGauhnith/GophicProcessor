package config

import (
	"github.com/IlfGauhnith/GophicProcessor/pkg/logger"
	"github.com/joho/godotenv"
)

func init() {
	initializeEnvironment()
}

func initializeEnvironment() {
	err := godotenv.Load()
	if err != nil {
		logger.Log.Warn("Error loading .env file")
		logger.Log.Warn("Environment variables will be loaded from the system")
	}

	logger.Log.Info("Environment variables loaded successfully from .env")

}
