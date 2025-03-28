package handler

import (
	_ "github.com/IlfGauhnith/GophicProcessor/pkg/config"

	"net/http"

	api_model "github.com/IlfGauhnith/GophicProcessor/cmd/api/model"
	jobs_persistence "github.com/IlfGauhnith/GophicProcessor/pkg/db/jobs_persistence"
	logger "github.com/IlfGauhnith/GophicProcessor/pkg/logger"
	model "github.com/IlfGauhnith/GophicProcessor/pkg/model"
	"github.com/IlfGauhnith/GophicProcessor/pkg/mq"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func ResizeImagesHandler(c *gin.Context) {
	logger.Log.Info("ResizeImagesHandler")

	var requestStruct api_model.ResizeRequest

	if err := c.ShouldBindJSON(&requestStruct); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	// Casting api_model.ResizeRequest to model.ResizeJob
	// model.ResizeJob struct has a field called JobID
	// which is a unique identifier for the job
	jobID := uuid.New().String()
	resizeJob := model.ResizeJob{
		Images:        requestStruct.Images,
		Algorithm:     requestStruct.Algorithm,
		ResizePercent: requestStruct.ResizePercent,
		JobID:         jobID,
		Status:        "In Progress",
	}
	logger.Log.Infof("jobID created: %s", jobID)

	if err := mq.PublishResizeJob(resizeJob); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to publish job"})
		return
	}
	logger.Log.Infof("jobID successfully published: %s", jobID)

	c.JSON(http.StatusAccepted, gin.H{"job_id": jobID})
}

func GetResizeJobStatus(c *gin.Context) {
	logger.Log.Info("GetResizeJobStatus")

	// Extract job ID from the URL
	jobId := c.Param("jobId")
	if jobId == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Job ID is required"})
		return
	}

	// Get the resize job from the database
	job, err := jobs_persistence.GetResizeJob(jobId)
	if err != nil {
		logger.Log.Errorf("Failed to get resize job status: %v", err)
		c.JSON(http.StatusNotFound, gin.H{"error": "Job not found"})
		return
	}

	// Prepare the response
	response := gin.H{
		"job_uuid": job.JobID,
		"status":   job.Status,
	}

	logger.Log.Infof("Job status retrieved successfully for job ID: %s", job.JobID)
	c.JSON(http.StatusOK, response)
}
