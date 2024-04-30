package main

import (
	"os"

	"github.com/joho/godotenv"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func Connection() (*gorm.DB, error) {
	err := godotenv.Load()

	if err != nil {
		println("Error loading .env file")
		return nil, err
	}

	connStr := os.Getenv("DB_CONNECTION_STRING")
	db, err := gorm.Open(postgres.Open(connStr), &gorm.Config{})

	if err != nil {
		println("Error connecting to database")
		return nil, err
	}

	return db, err
}
