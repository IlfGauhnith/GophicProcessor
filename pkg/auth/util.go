package auth

import (
	"crypto/rand"
	"encoding/base64"
	"fmt"
	"os"
	"time"

	logger "github.com/IlfGauhnith/GophicProcessor/pkg/logger"

	"github.com/dgrijalva/jwt-go"
)

// GenerateState generates a random string to use as the OAuth state.
// The 'length' parameter specifies how many random bytes to generate.
func GenerateState(length int) (string, error) {
	bytes := make([]byte, length)
	_, err := rand.Read(bytes)
	if err != nil {
		return "", fmt.Errorf("failed to generate random state: %v", err)
	}
	// Encode the random bytes into a URL-safe string.
	return base64.URLEncoding.EncodeToString(bytes), nil
}

var jwtSecret = []byte(os.Getenv("JWT_SECRET"))

// GenerateJWT generates a new JWT token with claims
func GenerateJWT(email string) (string, error) {
	claims := jwt.MapClaims{
		"user_id": email,                                // Custom claim
		"exp":     time.Now().Add(time.Hour * 8).Unix(), // Token expiration time (8 hours)
		"iat":     time.Now().Unix(),                    // Issued at time
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	// Sign the token with the secret key
	tokenString, err := token.SignedString(jwtSecret)
	if err != nil {
		logger.Log.Errorf("Error signing JWT token: %v", err)
		return "", err
	}

	logger.Log.Infof("JWT token generated for user %s", email)
	return tokenString, nil
}

// ValidateJWT verifies and parses the given JWT token
func ValidateJWT(tokenString string) (*jwt.Token, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		// Ensure the signing method is correct
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return jwtSecret, nil
	})

	if err != nil {
		logger.Log.Errorf("Error validating JWT token: %v", err)
		return nil, err
	}

	return token, nil
}
