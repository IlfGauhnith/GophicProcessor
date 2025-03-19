package handler

import (
	"net/http"

	auth "github.com/IlfGauhnith/GophicProcessor/pkg/auth"
	logger "github.com/IlfGauhnith/GophicProcessor/pkg/logger"
	"github.com/gin-gonic/gin"
)

func HealthHandler(c *gin.Context) {
	logger.Log.Info("HealthHandler")
	c.JSON(http.StatusOK, gin.H{"status": "API is running"})
}

func GoogleAuthHandler(c *gin.Context) {
	logger.Log.Info("GoogleAuthHandler")

	// Generate a new state for each auth request
	state, err := auth.GenerateState(32)
	if err != nil {
		logger.Log.Error("failed to generate oauth state")
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
	logger.Log.Info("GoogleAuthCallBackHandler")
	// Callback endpoint to handle Google's OAuth redirect

	// Retrieve the expected state from the cookie
	expectedState, err := c.Cookie("oauthstate")
	if err != nil {
		logger.Log.Error("state cookie not found")
		c.JSON(http.StatusBadRequest, gin.H{"error": "state cookie not found"})
		return
	}

	// Get the state from the request query parameters
	state := c.Query("state")
	if state != expectedState {
		logger.Log.Error("invalid oauth state")
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid oauth state"})
		return
	}

	// Get the authorization code from the query parameters
	code := c.Query("code")
	token, err := auth.ExchangeCode(code)
	if err != nil {
		logger.Log.Error("failed to exchange code: ", err.Error())
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Retrieve user info from Google using the access token
	userInfo, err := auth.GetUserInfo(token)
	if err != nil {
		logger.Log.Error("failed to get user info: ", err.Error())
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// For now, simply return the user info as JSON.
	c.JSON(http.StatusOK, userInfo)
}
