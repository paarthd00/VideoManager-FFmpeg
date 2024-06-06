package main

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"os"
	"strings"
	"time"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/joho/godotenv"
	"gorm.io/gorm"
)

type Video struct {
	gorm.Model
	Title     string
	Size      int64
	Duration  int
	Thumbnail string
	Source    string
}

type File struct {
	Name string
	Size int64
	Type string
}

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

var DB *gorm.DB

func (a *App) startup(ctx context.Context) {
	var err error
	DB, err = Connection()
	if err != nil {
		panic("failed to connect database")
	}

	DB.AutoMigrate(&Video{})
	a.ctx = ctx
}

func (a *App) GetPresignedUrl(file File) string {
	err := godotenv.Load()
	if err != nil {
		fmt.Println("Error loading .env file:", err)
		return ""
	}

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

	assetUrl := strings.Split(url, "?")[0]

	DB.Create(&Video{Title: file.Name, Size: file.Size, Source: assetUrl, Duration: 0, Thumbnail: ""})

	return url
}
