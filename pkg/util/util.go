package util

import (
	"os"
	"os/signal"
	"strings"
	"syscall"
	"time"

	_ "github.com/IlfGauhnith/GophicProcessor/pkg/config"
	db "github.com/IlfGauhnith/GophicProcessor/pkg/db"
	logger "github.com/IlfGauhnith/GophicProcessor/pkg/logger"
	model "github.com/IlfGauhnith/GophicProcessor/pkg/model"
	"github.com/IlfGauhnith/GophicProcessor/pkg/mq"
)

func GetStage() string {
	stage := os.Getenv("STAGE")

	if stage == "" {
		stage = "PROD"
	}

	return stage
}

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

// NewUserFromGoogleUserInfo transforms a GoogleUserInfo into a User model.
// It sets the AuthProvider to "google", uses the current time for timestamps,
// and derives a username if one is not provided by using the email's local part.
func NewUserFromGoogleUserInfo(googleUser model.GoogleUserInfo) *model.User {
	now := time.Now()

	// Use googleUser.Name as the username if provided;
	// otherwise, default to the portion of the email before the '@'.
	username := googleUser.Name
	if username == "" {
		parts := strings.Split(googleUser.Email, "@")
		if len(parts) > 0 {
			username = parts[0]
		}
	}

	return &model.User{
		Username:     username,
		Email:        googleUser.Email,
		GoogleID:     googleUser.ID,
		GivenName:    googleUser.GivenName,
		FamilyName:   googleUser.FamilyName,
		PictureURL:   googleUser.Picture,
		AuthProvider: "google",
		UpdatedAt:    now,
		LastLogin:    now,
		IsActive:     true,
		// PasswordHash and Salt remain empty because this user signed in with Google.
	}
}
