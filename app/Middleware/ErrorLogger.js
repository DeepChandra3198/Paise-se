const winston = require("winston");
const { createLogger, format } = winston;
const { combine, timestamp, printf } = format;
const DailyRotateFile = require("winston-daily-rotate-file");

// Define the log format
const logFormat = printf(({ timestamp, level, message }) => {
  
  return `[${timestamp}] ${level}: ${message}`;
});

// Create a new Winston logger
const logger = createLogger({
  format: combine(timestamp({ format: "YYYY-MMMM-DD hh:mm:ss A" }), logFormat),
  transports: [
    new DailyRotateFile({
      filename: "logs/error-%DATE%.log",
      datePattern: "YYYY-MMMM-DD",
      level: "error",
      maxSize: "20m", // optional: specify the maximum size for each log file
      maxFiles: "7d", // optional: specify the maximum number of log files to keep
    }),
  ],
});

module.exports = {
  logger,
};
