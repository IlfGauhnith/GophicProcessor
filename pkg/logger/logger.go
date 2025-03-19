package logger

import (
	"io"
	"os"

	"github.com/sirupsen/logrus"
)

// Log is the exported logger instance.
var Log *logrus.Logger

func init() {
	Log = logrus.New()

	// Ensure the logs directory exists.
	if err := os.MkdirAll("logs", 0755); err != nil {
		Log.Fatalf("Failed to create logs directory: %v", err)
	}

	// Open or create the log file in append mode.
	logFile, err := os.OpenFile("logs/gophic.log", os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666)
	if err != nil {
		Log.Fatalf("Failed to open log file: %v", err)
	}

	// Write logs to both stdout and the log file.
	Log.SetOutput(io.MultiWriter(os.Stdout, logFile))

	// Set JSON formatter for structured logs.
	Log.SetFormatter(&logrus.JSONFormatter{})

	// Set the logging level to debug.
	Log.SetLevel(logrus.DebugLevel)
}
