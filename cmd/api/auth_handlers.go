package handlers

import (
	"net/http"

	"github.com/IlfGauhnith/GophicProcessor/pkg/auth"
	"github.com/gin-gonic/gin"
)

func HealthHandler(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"status": "API is running"})
}

func GoogleAuthHandler(c *gin.Context) {
	// Generate a new state for each auth request
	state, err := auth.GenerateState(32)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to generate state"})
		return
	}

	// Store the state in a cookie (valid for 1 hour)
	c.SetCookie("oauthstate", state, 3600, "", "", false, true)

	// Redirect to Google's OAuth consent page with the generated state
	url := auth.GetAuthURL(state)
	c.Redirect(http.StatusTemporaryRedirect, url)
}

func GoogleAuthCallBackHandler(c *gin.Context) {
	// Callback endpoint to handle Google's OAuth redirect

	// Retrieve the expected state from the cookie
	expectedState, err := c.Cookie("oauthstate")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "state cookie not found"})
		return
	}

	// Get the state from the request query parameters
	state := c.Query("state")
	if state != expectedState {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid oauth state"})
		return
	}

	// Get the authorization code from the query parameters
	code := c.Query("code")
	token, err := auth.ExchangeCode(code)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Retrieve user info from Google using the access token
	userInfo, err := auth.GetUserInfo(token)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// For now, simply return the user info as JSON.
	c.JSON(http.StatusOK, userInfo)
}
