package auth

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"

	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
)

var oauthConfig *oauth2.Config

// In the init function we set up our OAuth configuration using environment variables.
func init() {
	oauthConfig = &oauth2.Config{
		RedirectURL:  os.Getenv("GOOGLE_REDIRECT_URL"), // DEV: "http://localhost:8080/auth/google/callback"
		ClientID:     os.Getenv("GOOGLE_CLIENT_ID"),
		ClientSecret: os.Getenv("GOOGLE_CLIENT_SECRET"),
		Scopes: []string{
			"https://www.googleapis.com/auth/userinfo.email",
			"https://www.googleapis.com/auth/userinfo.profile",
		},
		Endpoint: google.Endpoint,
	}
}

// For simplicity, we use a static state string. In production, generate and store a random string per session.
var oauthStateString = "randomstate"

// GetAuthURL generates the URL for Google's OAuth consent page.
func GetAuthURL() string {
	return oauthConfig.AuthCodeURL(oauthStateString)
}

// HandleCallback validates the state and exchanges the code for an access token.
func HandleCallback(r *http.Request) (*oauth2.Token, error) {
	state := r.FormValue("state")

	if state != oauthStateString {
		return nil, fmt.Errorf("invalid oauth state")
	}

	code := r.FormValue("code")
	token, err := oauthConfig.Exchange(context.Background(), code)

	if err != nil {
		return nil, fmt.Errorf("failed to exchange token: %v", err)
	}

	return token, nil
}

// GetUserInfo uses the access token to retrieve user info from Google.
func GetUserInfo(token *oauth2.Token) (map[string]interface{}, error) {
	client := oauthConfig.Client(context.Background(), token)
	response, err := client.Get("https://www.googleapis.com/oauth2/v2/userinfo")

	if err != nil {
		return nil, err
	}

	defer response.Body.Close()
	data, err := ioutil.ReadAll(response.Body)

	if err != nil {
		return nil, err
	}

	var userInfo map[string]interface{}
	if err := json.Unmarshal(data, &userInfo); err != nil {
		return nil, err
	}

	return userInfo, nil
}
