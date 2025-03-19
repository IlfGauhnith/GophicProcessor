package main

import (
	handler "github.com/IlfGauhnith/GophicProcessor/cmd/api/handler"
	logger "github.com/IlfGauhnith/GophicProcessor/pkg/logger"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func init() {
	err := godotenv.Load()
	if err != nil {
		logger.Log.Warn("Error loading .env file")
		logger.Log.Warn("Environment variables will be loaded from the system")
	}

	logger.Log.Info("Environment variables loaded successfully from .env")
}

func main() {
	port := ":8080"

	logger.Log.Info("Starting API server")

	router := gin.Default()

	// Health endpoint
	router.GET("/health", handler.HealthHandler)

	// Endpoint to initiate Google OAuth login
	router.GET("/auth/google", handler.GoogleAuthHandler)

	// Callback endpoint to handle Google's OAuth redirect
	router.GET("/auth/google/callback", handler.GoogleAuthCallBackHandler)

	logger.Log.Infof("API server listening on port %s", port)
	router.Run(port)
}
