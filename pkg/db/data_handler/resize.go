package data_handler

import (
	"context"
	"fmt"

	_ "github.com/IlfGauhnith/GophicProcessor/pkg/config"

	db "github.com/IlfGauhnith/GophicProcessor/pkg/db"
	logger "github.com/IlfGauhnith/GophicProcessor/pkg/logger"
	model "github.com/IlfGauhnith/GophicProcessor/pkg/model"
	"github.com/jackc/pgx/v5"
)

// SaveJobResult saves the result of a job to the database
func SaveResizeJob(resizeJob model.ResizeJob) error {
	query := `
    INSERT INTO tb_resize_job (resize_job_uuid, status, imgs_urls, algorithm, owner_id)
    VALUES ($1, $2, $3, $4, $5)
    ON CONFLICT (resize_job_uuid) DO UPDATE
    SET status = $2, imgs_urls = $3;
    `

	conn, err := db.GetDB().Acquire(context.Background())
	if err != nil {
		logger.Log.Errorf("Failed to acquire DB connection: %v", err)
		return err
	}
	logger.Log.Info("DB connection successfully acquired.")
	defer conn.Release()

	_, err = conn.Exec(context.Background(), query, resizeJob.JobID, resizeJob.Status, resizeJob.Images, resizeJob.Algorithm, resizeJob.OwnerID)
	if err != nil {
		logger.Log.Errorf("Failed to save resize job result: %v", err)
		return err
	}

	logger.Log.Infof("Successfully saved resize job result for job ID: %s", resizeJob.JobID)
	return nil
}

func GetResizeJob(jobID string) (*model.ResizeJob, error) {
	query := `
    SELECT resize_job_uuid, status, imgs_urls, algorithm, owner_id, resize_job_id 
    FROM tb_resize_job
    WHERE resize_job_uuid = $1;
    `
	conn, err := db.GetDB().Acquire(context.Background())
	if err != nil {
		logger.Log.Errorf("Failed to acquire DB connection: %v", err)
		return nil, err
	}
	logger.Log.Info("DB connection successfully acquired.")
	defer conn.Release()

	var jobIDResult, status, algorithm string
	var images []string
	var ownerID, resizeJobID int
	err = conn.QueryRow(context.Background(), query, jobID).Scan(&jobIDResult, &status, &images, &algorithm, &ownerID, &resizeJobID)
	if err == pgx.ErrNoRows {
		logger.Log.Warnf("No resize job found with ID: %s", jobID)
		return nil, fmt.Errorf("resize job not found")
	} else if err != nil {
		logger.Log.Errorf("Failed to get job result: %v", err)
		return nil, err
	}

	// Construct the ResizeJob object
	job := &model.ResizeJob{
		JobID:     jobIDResult,
		Status:    status,
		Images:    images,
		Algorithm: algorithm,
		OwnerID:   ownerID,
		Id:        resizeJobID,
	}

	logger.Log.Infof("Successfully retrieved resize job for job ID: %s", jobID)
	return job, nil
}

// UpdateJobStatus updates the status of an existing job
func UpdateResizeJobStatus(jobID, status string) error {
	query := `
    UPDATE tb_resize_job
    SET status = $1
    WHERE resize_job_uuid = $2;
    `
	conn, err := db.GetDB().Acquire(context.Background())
	if err != nil {
		logger.Log.Errorf("Failed to acquire DB connection: %v", err)
		return err
	}
	logger.Log.Info("DB connection successfully acquired.")
	defer conn.Release()

	_, err = conn.Exec(context.Background(), query, status, jobID)
	if err != nil {
		logger.Log.Errorf("Failed to update resize job status: %v", err)
		return err
	}

	logger.Log.Infof("Successfully updated resize job status for job ID: %s to %s", jobID, status)
	return nil
}

// GetResizeJobsByOwner retrieves all resize jobs for a given owner (user_id)
func GetResizeJobsByOwner(ownerID int) ([]*model.ResizeJob, error) {
	logger.Log.Infof("Getting resize jobs for owner_id: %d", ownerID)

	conn, err := db.GetDB().Acquire(context.Background())
	if err != nil {
		logger.Log.Errorf("Failed to acquire DB connection: %v", err)
		return nil, err
	}
	logger.Log.Info("DB connection successfully acquired.")
	defer conn.Release()

	// Adjust the query according to your table's schema.
	query := `
		SELECT resize_job_uuid, status, imgs_urls, algorithm, owner_id, resize_job_id
		FROM tb_resize_job
		WHERE owner_id = $1;
	`

	rows, err := conn.Query(context.Background(), query, ownerID)
	if err != nil {
		logger.Log.Errorf("Failed to query resize jobs for owner_id %d: %v", ownerID, err)
		return nil, err
	}
	defer rows.Close()

	var jobs []*model.ResizeJob

	for rows.Next() {
		var jobID string
		var status string
		var images []string // Scans directly from the TEXT[] column
		var algorithm string
		var ownerIDResult int
		var resizeJobID int

		err = rows.Scan(&jobID, &status, &images, &algorithm, &ownerIDResult, &resizeJobID)
		if err != nil {
			logger.Log.Errorf("Error scanning row: %v", err)
			return nil, err
		}

		job := &model.ResizeJob{
			JobID:     jobID,
			Status:    status,
			Images:    images,
			Algorithm: algorithm,
			OwnerID:   ownerIDResult,
			Id:        resizeJobID,
		}

		jobs = append(jobs, job)
	}

	if err = rows.Err(); err != nil {
		logger.Log.Errorf("Error iterating over rows: %v", err)
		return nil, err
	}

	logger.Log.Infof("Successfully retrieved %d resize jobs for owner_id: %d", len(jobs), ownerID)
	return jobs, nil
}
