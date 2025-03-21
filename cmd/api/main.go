package main

import (
	_ "github.com/IlfGauhnith/GophicProcessor/pkg/config"

	handler "github.com/IlfGauhnith/GophicProcessor/cmd/api/handler"
	logger "github.com/IlfGauhnith/GophicProcessor/pkg/logger"
	"github.com/gin-gonic/gin"
)

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
