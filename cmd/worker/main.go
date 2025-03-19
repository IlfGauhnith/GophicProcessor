package main

import (
	"log"
	"time"
)

func main() {
	// Simulate starting a worker pool for processing image jobs
	log.Println("Worker service starting...")

	// Dummy loop to simulate processing
	for {
		log.Println("Worker is checking for jobs...")
		time.Sleep(10 * time.Second)
	}
}
