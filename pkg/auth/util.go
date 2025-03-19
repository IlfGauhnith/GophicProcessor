package auth

import (
	"crypto/rand"
	"encoding/base64"
	"fmt"
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
