package main

import (
	"log"

	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()

	// Health endpoint
	router.GET("/health", HealthHandler)

	// Endpoint to initiate Google OAuth login
	router.GET("/auth/google", GoogleAuthHandler)

	// Callback endpoint to handle Google's OAuth redirect
	router.GET("/auth/google/callback", GoogleAuthCallBackHandler)

	log.Println("API server starting on :8080")
	router.Run(":8080")
}
