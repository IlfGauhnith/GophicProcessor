package config

import (
	"log"

	"github.com/joho/godotenv"
)

func init() {
	initializeEnvironment()
}

func initializeEnvironment() {
	err := godotenv.Load()
	if err != nil {
		log.Println("Error loading .env file")
		log.Println("Environment variables will be loaded from the system")
	}

	log.Println("Environment variables loaded successfully from .env")
}
