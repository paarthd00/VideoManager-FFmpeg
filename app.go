package main

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"os"
	"time"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/joho/godotenv"
)

type File struct {
	Name string
	Size int64
	Type string
}

// App struct
type App struct {
	ctx context.Context
}

func generateRandomString() (string, error) {
	bytes := make([]byte, 32)
	_, err := rand.Read(bytes)
	if err != nil {
		return "", err
	}
	return hex.EncodeToString(bytes), nil
}

func NewApp() *App {
	return &App{}
}

func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

func (a *App) Greet(file File) string {
	//os load env
	err := godotenv.Load()
	// create a presigned url with putobject
	fmt.Println("Creating presigned URL for", os.Getenv("BUCKET_REGION"))
	s3Config := &aws.Config{
		Region: aws.String(os.Getenv("BUCKET_REGION")),
		Credentials: credentials.NewStaticCredentials(
			os.Getenv("AWS_KEY"),
			os.Getenv("AWS_SEC_KEY"),
			"",
		),
	}

	s3Session, err := session.NewSession(s3Config, nil)
	if err != nil {
		fmt.Println("Error creating S3 session:", err)
		return ""
	}

	randomString, err := generateRandomString()
	if err != nil {
		// handle error
		fmt.Println("Error generating random string:", err)
		return ""
	}

	s3Client := s3.New(s3Session)

	req, _ := s3Client.PutObjectRequest(&s3.PutObjectInput{
		Bucket: aws.String(os.Getenv("BUCKET_NAME")),
		Key:    aws.String(randomString),
	})

	url, err := req.Presign(15 * time.Minute)
	if err != nil {
		fmt.Println("Error generating presigned URL:", err)
		return ""
	}

	fmt.Println("The URL is", url)
	return url
}
