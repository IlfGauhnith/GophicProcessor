package middleware

import (
	"net/http"
	"strings"

	"github.com/IlfGauhnith/GophicProcessor/pkg/auth"
	_ "github.com/IlfGauhnith/GophicProcessor/pkg/config"
	"github.com/IlfGauhnith/GophicProcessor/pkg/logger"
	"github.com/gin-gonic/gin"
)

// AuthMiddleware checks for a valid JWT token in the Authorization header
func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Get the Authorization header
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			logger.Log.Warn("Missing Authorization header")
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header missing"})
			c.Abort()
			return
		}

		// Extract the token from "Bearer <token>"
		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		if tokenString == authHeader {
			logger.Log.Warn("Bearer token not found in header")
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token format"})
			c.Abort()
			return
		}

		// Validate the JWT token
		token, err := auth.ValidateJWT(tokenString)
		if err != nil || !token.Valid {
			logger.Log.Warnf("Invalid token: %v", err)
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
			c.Abort()
			return
		}

		// Proceed to the next middleware or handler
		c.Next()
	}
}
