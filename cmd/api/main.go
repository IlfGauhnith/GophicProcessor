package main

import (
	"log"
	"net/http"

	"github.com/IlfGauhnith/GophicProcessor/pkg/auth"
	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()

	// Define a basic health check endpoint
	router.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "API is running"})
	})

	// Endpoint to initiate Google OAuth login
	router.GET("/auth/google", func(c *gin.Context) {
		url := auth.GetAuthURL()
		c.Redirect(http.StatusTemporaryRedirect, url)
	})

	// Callback endpoint to handle Google’s redirect
	router.GET("/auth/google/callback", func(c *gin.Context) {
		token, err := auth.HandleCallback(c.Request)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		userInfo, err := auth.GetUserInfo(token)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		// In a real-world app, create a session or issue a JWT here.
		// For now, we simply return the user info.
		c.JSON(http.StatusOK, userInfo)
	})

	log.Println("API server starting on :8080")
	router.Run(":8080")
}
