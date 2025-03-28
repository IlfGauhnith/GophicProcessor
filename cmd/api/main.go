package main

import (
	"time"

	_ "github.com/IlfGauhnith/GophicProcessor/pkg/config"
	"github.com/gin-contrib/cors"

	routes "github.com/IlfGauhnith/GophicProcessor/cmd/api/routes"
	logger "github.com/IlfGauhnith/GophicProcessor/pkg/logger"
	util "github.com/IlfGauhnith/GophicProcessor/pkg/util"

	"github.com/gin-gonic/gin"
)

func main() {
	port := ":8080"
	logger.Log.Info("Starting API server")

	// Run shutdown signal handling in a separate goroutine
	// for clean shutdown
	go util.WaitForShutdown()

	router := gin.Default()

	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"}, // React dev server origin
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour, // Browser can cache this config for 12 hours
	}))

	// Initialize routes from the router package
	routes.InitRoutes(router)
	logger.Log.Info("Routes successfully initialized.")

	logger.Log.Infof("API server listening on port %s", port)
	router.Run(port)
}
