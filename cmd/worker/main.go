package main

import (
	_ "net/http/pprof"

	"net/http"

	"runtime"
	"sync"

	_ "github.com/IlfGauhnith/GophicProcessor/pkg/config"
	db "github.com/IlfGauhnith/GophicProcessor/pkg/db"
	jobs_persistence "github.com/IlfGauhnith/GophicProcessor/pkg/db/jobs_persistence"
	resize "github.com/IlfGauhnith/GophicProcessor/pkg/imageproc/resize"
	logger "github.com/IlfGauhnith/GophicProcessor/pkg/logger"
	model "github.com/IlfGauhnith/GophicProcessor/pkg/model"
	mq "github.com/IlfGauhnith/GophicProcessor/pkg/mq"
	util "github.com/IlfGauhnith/GophicProcessor/pkg/util"
)

func main() {
	logger.Log.Info("Worker started")

	// Starting pprof server
	go func() {
		logger.Log.Info("Starting pprof on :6060")
		http.ListenAndServe(":6060", nil)
	}()

	// Run shutdown signal handling in a separate goroutine
	// for clean shutdown
	go util.WaitForShutdown()

	// Initializes db
	db.InitDB()

	// This ensures the application fully utilizes all CPU cores.
	// This is important for the worker to be able to process multiple jobs concurrently.
	runtime.GOMAXPROCS(runtime.NumCPU())
	logger.Log.Infof("Number of CPUs: %d", runtime.NumCPU())

	// Creates a channel of type model.ResizeJob to communicate
	// job data between goroutines.
	jobs := make(chan model.ResizeJob)

	// Initializes a wait group to keep track of running goroutines
	// and ensure the application waits for their completion.
	var wg sync.WaitGroup

	// Worker pool
	// Starts a number of goroutines equal to the number of CPUs
	for i := 0; i < runtime.NumCPU(); i++ {

		// Increments the wait group counter
		// to indicate a new goroutine has started.
		wg.Add(1)

		// Starts a new goroutine to process jobs from the jobs channel.
		// The goroutine will run until the channel is closed.
		go func() {
			// Decrements the wait group counter
			defer wg.Done()

			// Loops over the jobs channel to process each job.
			// The loop will exit when the channel is closed.
			// The for job := range jobs loop will block and wait if the channel is empty.
			// The goroutine will not consume any CPU while waiting.
			// As soon as a new job arrives in the channel, the goroutine immediately picks it up and processes it.
			for job := range jobs {
				if imgs, err := resize.ResizeImages(job); err != nil {
					logger.Log.Warnf("Error processing job %s: %v", job.JobID, err)
				} else {

					job.Images = imgs
					job.Status = "Completed"
					jobs_persistence.SaveResizeJob(job)

					logger.Log.Infof("Job %s completed with %d images processed", job.JobID, len(imgs))
				}
			}
		}()
	}

	// If the consumer (mq.ConsumeResizeJobs) tries to push jobs
	// to the channel before workers are ready,
	// it will block and potentially cause a deadlock.
	mq.ConsumeResizeJobs(jobs)

	// Ensures that the program does not exit before all jobs are handled.
	wg.Wait()
}
