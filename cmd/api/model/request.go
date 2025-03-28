package model

type ResizeRequest struct {
	Images        []string `json:"images"`
	Algorithm     string   `json:"algorithm"`
	ResizePercent int      `json:"resize_percent"`
}
