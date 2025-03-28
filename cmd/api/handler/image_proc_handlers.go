package handler

import (
	_ "github.com/IlfGauhnith/GophicProcessor/pkg/config"

	"net/http"

	api_model "github.com/IlfGauhnith/GophicProcessor/cmd/api/model"
	model "github.com/IlfGauhnith/GophicProcessor/pkg/model"

	logger "github.com/IlfGauhnith/GophicProcessor/pkg/logger"
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
