package handler

import (
	"encoding/json"
	"fmt"
	"os"

	_ "github.com/IlfGauhnith/GophicProcessor/pkg/config"
	model "github.com/IlfGauhnith/GophicProcessor/pkg/model"

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

	// Send redirect url as googleUrl
	url := auth.GetAuthURL(state)
	c.JSON(http.StatusOK, gin.H{"googleUrl": url})
}

func GoogleAuthCallBackHandler(c *gin.Context) {
	logger.Log.Info("GoogleAuthCallBackHandler")

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

	// Convert the user info map to the struct
	var userInfoStruct model.GoogleUserInfo
	userInfoBytes, err := json.Marshal(userInfo)
	if err != nil {
		logger.Log.Error("failed to marshal user info: ", err.Error())
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to marshal user info"})
		return
	}

	err = json.Unmarshal(userInfoBytes, &userInfoStruct)
	if err != nil {
		logger.Log.Error("failed to unmarshal user info: ", err.Error())
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to unmarshal user info"})
		return
	}

	jwt, err := auth.GenerateJWT(userInfoStruct.Email)
	if err != nil {
		logger.Log.Error("failed to generate JWT: ", err.Error())
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to generate token"})
		return
	}

	// Redirect to frontend with JWT and user info as query parameters
	frontendURL := os.Getenv("FRONTEND_URL")
	redirectURL := fmt.Sprintf("%s/OAuthCallback?token=%s&name=%s&email=%s", frontendURL, jwt, userInfoStruct.Name, userInfoStruct.Email)
	c.Redirect(http.StatusFound, redirectURL)
}
