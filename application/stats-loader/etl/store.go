package main

import (
	"bytes"
	"encoding/json"
	"fmt"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/awserr"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
)

// Uploader is an interface that represents the ability
// to upload stats to storage.
type Uploader interface {
	Upload(stats AreaStats) error
}

// S3Uploader uploads stats to S3.
type S3Uploader struct {
	svc *s3.S3
}

// Upload uploads the stats for a specific area to S3
func (u *S3Uploader) Upload(stats AreaStats) error {
	// Upload the file to S3.
	key := createKey(stats)
	data, mErr := json.Marshal(stats)
	if mErr != nil {
		return fmt.Errorf("Unable to marshal stats to json: %w", mErr)
	}
	input := &s3.PutObjectInput{
		Body:        aws.ReadSeekCloser(bytes.NewReader(data)),
		Bucket:      aws.String("covidstats.uk"),
		Key:         aws.String(key),
		ContentType: aws.String("application/json"),
	}

	_, err := u.svc.PutObject(input)
	if err != nil {
		if aerr, ok := err.(awserr.Error); ok {
			switch aerr.Code() {
			default:
				fmt.Println(aerr.Error())
			}
		} else {
			// Print the error, cast err to awserr.Error to get the Code and
			// Message from an error.
			fmt.Println(err.Error())
		}
		return err
	}

	return nil
}

func createKey(stats AreaStats) string {
	var fn string
	if stats.AreaType == "ltla" {
		fn = stats.AreaCode
	} else {
		fn = stats.AreaName
	}
	return fmt.Sprintf("stats/%s/%s.json", stats.AreaType, fn)
}

// NewUploader returns a new Uploader
func NewUploader() Uploader {
	return &S3Uploader{
		svc: s3.New(session.New(), &aws.Config{
			Region: aws.String("eu-west-1"),
		}),
	}
}
