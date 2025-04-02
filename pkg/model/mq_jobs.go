package model

type ResizeJob struct {
	Id            int      `json:"id"`
	Images        []string `json:"images"`
	Algorithm     string   `json:"algorithm"`
	ResizePercent int      `json:"resize_percent"`
	JobID         string   `json:"job_id"`
	Status        string   `json:"status"`
	OwnerID       int      `json:"owner_Id"`
}
