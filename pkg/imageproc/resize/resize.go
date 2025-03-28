package resize

import (
	"bytes"
	"fmt"
	"image/jpeg"

	_ "github.com/IlfGauhnith/GophicProcessor/pkg/config"
	logger "github.com/IlfGauhnith/GophicProcessor/pkg/logger"
	"github.com/IlfGauhnith/GophicProcessor/pkg/model"
	util "github.com/IlfGauhnith/GophicProcessor/pkg/util"
)

func ResizeImages(job model.ResizeJob) ([]string, error) {
	logger.Log.Infof("Processing job %s with algorithm %s and resize percent %d",
		job.JobID, job.Algorithm, job.ResizePercent)

	strategy, err := GetResizeStrategy(job.Algorithm)
	if err != nil {
		logger.Log.Errorf("Invalid resize algorithm: %s", job.Algorithm)
		return nil, err
	}

	imageURLs := make([]string, len(job.Images))

	for i, base64Str := range job.Images {
		img, err := util.DecodeBase64Image(base64Str)
		if err != nil {
			logger.Log.Warnf("Failed to decode image %d: %v", i, err)
			continue
		}

		// Calculate the new dimensions based on the resize percent
		width := uint(float64(img.Bounds().Dx()) * (float64(job.ResizePercent) / 100))
		height := uint(float64(img.Bounds().Dy()) * (float64(job.ResizePercent) / 100))

		resizedImg := strategy.Resize(img, width, height)

		var buf bytes.Buffer
		err = jpeg.Encode(&buf, resizedImg, nil)
		if err != nil {
			logger.Log.Warnf("Failed to encode resized image %d: %v", i, err)
			continue
		}

		fileName := fmt.Sprintf("%s_%d.jpg", job.JobID, i+1)
		imageURL, err := util.UploadToR2(buf.Bytes(), fileName)
		if err != nil {
			logger.Log.Warnf("Failed to upload resized image %d to S3: %v", i, err)
			continue
		}

		imageURLs[i] = imageURL
		logger.Log.Infof("Successfully uploaded resized image %d for job %s to %s", i+1, job.JobID, imageURL)
	}

	return imageURLs, nil
}
