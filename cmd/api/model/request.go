package model

type ResizeRequest struct {
	Images       []string `json:"images"`
	Algorithm    string   `json:"algorithm"`
	TargetWidth  int      `json:"targetWidth"`
	TargetHeight int      `json:"targetHeight"`
}
