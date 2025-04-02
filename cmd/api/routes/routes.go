package routes

import (
	handler "github.com/IlfGauhnith/GophicProcessor/cmd/api/handler"
	"github.com/IlfGauhnith/GophicProcessor/cmd/api/middleware"
	"github.com/gin-gonic/gin"
)

// InitRoutes initializes the API routes
func InitRoutes(router *gin.Engine) {
	// Health endpoint
	router.GET("/health", handler.HealthHandler)

	// Authentication endpoints
	authRoutes := router.Group("/auth")
	{
		authRoutes.GET("/google", handler.GoogleAuthHandler)
		authRoutes.GET("/google/callback", handler.GoogleAuthCallBackHandler)
	}

	// Image resize endpoints
	imageRoutes := router.Group("/resize-images")
	imageRoutes.Use(middleware.AuthMiddleware())
	{
		imageRoutes.POST("/", handler.ResizeImagesHandler)

		imageRoutes.GET("/", handler.GetResizeJob)
		imageRoutes.GET("/:jobId", handler.GetResizeJobByID)
		imageRoutes.GET("/status/:jobId", handler.GetResizeJobStatus)
	}
}
