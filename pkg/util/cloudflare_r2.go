package util

import (
	"bytes"
	"fmt"
	"os"
	"time"

	_ "github.com/IlfGauhnith/GophicProcessor/pkg/config"
	"github.com/IlfGauhnith/GophicProcessor/pkg/logger"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
)

func UploadToR2(imageData []byte, fileName string) (string, error) {
	bucket := os.Getenv("R2_BUCKET_NAME")
	accountID := os.Getenv("R2_ACCOUNT_ID")
	accessKey := os.Getenv("R2_ACCESS_KEY_ID")
	secretKey := os.Getenv("R2_SECRET_ACCESS_KEY")

	region := "auto" // Set to a standard region instead of "auto"

	// Create a new session with AWS SDK
	sess, err := session.NewSession(&aws.Config{
		Region: aws.String(region),
		Credentials: credentials.NewStaticCredentials(
			accessKey,
			secretKey,
			"",
		),
		Endpoint:         aws.String(fmt.Sprintf("https://%s.r2.cloudflarestorage.com", accountID)),
		S3ForcePathStyle: aws.Bool(true), // Important for Cloudflare R2
	})
	if err != nil {
		return "", fmt.Errorf("failed to create R2 session: %v", err)
	}

	svc := s3.New(sess)
	input := &s3.PutObjectInput{
		Bucket: aws.String(bucket),
		Key:    aws.String(fileName),
		Body:   bytes.NewReader(imageData),
		ACL:    aws.String("public-read"),
	}

	_, err = svc.PutObject(input)
	if err != nil {
		return "", fmt.Errorf("failed to upload image to R2: %v", err)
	}

	presignedURL, err := GeneratePresignedURL(fileName)
	if err != nil {
		logger.Log.Errorf("Failed to generate presigned URL: %v", err)
		return "", fmt.Errorf("failed to generate presigned URL: %v", err)
	}

	return presignedURL, nil
}

func GeneratePresignedURL(fileName string) (string, error) {
	bucket := os.Getenv("R2_BUCKET_NAME")
	accountID := os.Getenv("R2_ACCOUNT_ID")
	accessKey := os.Getenv("R2_ACCESS_KEY_ID")
	secretKey := os.Getenv("R2_SECRET_ACCESS_KEY")

	region := "auto" // or your region if applicable

	sess, err := session.NewSession(&aws.Config{
		Region: aws.String(region),
		Credentials: credentials.NewStaticCredentials(
			accessKey,
			secretKey,
			"",
		),
		Endpoint:         aws.String(fmt.Sprintf("https://%s.r2.cloudflarestorage.com", accountID)),
		S3ForcePathStyle: aws.Bool(true),
	})
	if err != nil {
		return "", fmt.Errorf("failed to create session: %v", err)
	}

	svc := s3.New(sess)

	// Create a GetObjectRequest.
	req, _ := svc.GetObjectRequest(&s3.GetObjectInput{
		Bucket: aws.String(bucket),
		Key:    aws.String(fileName),
	})

	// Presign the request for 10 days.
	urlStr, err := req.Presign(240 * time.Hour)
	if err != nil {
		return "", fmt.Errorf("failed to sign request: %v", err)
	}

	return urlStr, nil
}
