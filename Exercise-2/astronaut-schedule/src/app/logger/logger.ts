// Import at runtime; types may not be present in this environment
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf((info: { timestamp: string; level: string; message: string }) => `${info.timestamp} [${info.level}] ${info.message}`)
  ),
  transports: [new winston.transports.Console()],
});

export function getLogger() {
  return logger;
}
