package jobs_persistence

import (
	"context"
	"fmt"
	"strings"

	_ "github.com/IlfGauhnith/GophicProcessor/pkg/config"
	db "github.com/IlfGauhnith/GophicProcessor/pkg/db"
	logger "github.com/IlfGauhnith/GophicProcessor/pkg/logger"
	model "github.com/IlfGauhnith/GophicProcessor/pkg/model"
	"github.com/jackc/pgx/v5"
)

// SaveJobResult saves the result of a job to the database
func SaveResizeJob(resizeJob model.ResizeJob) error {
	query := `
    INSERT INTO resize_job (resize_job_uuid, status, imgs_urls, algorithm)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (resize_job_uuid) DO UPDATE
    SET status = $2, imgs_urls = $3;
    `

	conn, err := db.GetDB().Acquire(context.Background())
	if err != nil {
		logger.Log.Errorf("Failed to acquire DB connection: %v", err)
		return err
	}
	defer conn.Release()

	_, err = conn.Exec(context.Background(), query, resizeJob.JobID, resizeJob.Status, resizeJob.Images, resizeJob.Algorithm)
	if err != nil {
		logger.Log.Errorf("Failed to save resize job result: %v", err)
		return err
	}

	logger.Log.Infof("Successfully saved resize job result for job ID: %s", resizeJob.JobID)
	return nil
}

func GetResizeJob(jobID string) (*model.ResizeJob, error) {
	query := `
    SELECT resize_job_uuid, status, imgs_urls, algorithm
    FROM resize_job
    WHERE resize_job_uuid = $1;
    `
	conn, err := db.GetDB().Acquire(context.Background())
	if err != nil {
		logger.Log.Errorf("Failed to acquire DB connection: %v", err)
		return nil, err
	}
	defer conn.Release()

	var jobIDResult, status, algorithm, result string
	err = conn.QueryRow(context.Background(), query, jobID).Scan(&jobIDResult, &status, &result, &algorithm)
	if err == pgx.ErrNoRows {
		logger.Log.Warnf("No resize job found with ID: %s", jobID)
		return nil, fmt.Errorf("resize job not found")
	} else if err != nil {
		logger.Log.Errorf("Failed to get job result: %v", err)
		return nil, err
	}

	// Split the result (which is stored as a comma-separated string) into an array of image URLs
	imgURLs := strings.Split(result, ",")

	// Construct the ResizeJob object
	job := &model.ResizeJob{
		JobID:     jobIDResult,
		Status:    status,
		Images:    imgURLs,
		Algorithm: algorithm,
	}

	logger.Log.Infof("Successfully retrieved resize job for job ID: %s", jobID)
	return job, nil
}

// UpdateJobStatus updates the status of an existing job
func UpdateResizeJobStatus(jobID, status string) error {
	query := `
    UPDATE resize_job
    SET status = $1
    WHERE resize_job_uuid = $2;
    `
	conn, err := db.GetDB().Acquire(context.Background())
	if err != nil {
		logger.Log.Errorf("Failed to acquire DB connection: %v", err)
		return err
	}
	defer conn.Release()

	_, err = conn.Exec(context.Background(), query, status, jobID)
	if err != nil {
		logger.Log.Errorf("Failed to update resize job status: %v", err)
		return err
	}

	logger.Log.Infof("Successfully updated resize job status for job ID: %s to %s", jobID, status)
	return nil
}
