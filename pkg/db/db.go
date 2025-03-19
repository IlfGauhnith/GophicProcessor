package db

import (
	"database/sql"
	"log"

	_ "github.com/lib/pq"
)

// Connect returns a database connection.
func Connect(connStr string) *sql.DB {
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatalf("Failed to open database: %v", err)
	}
	return db
}
