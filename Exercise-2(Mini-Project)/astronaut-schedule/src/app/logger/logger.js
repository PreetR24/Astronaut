"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLogger = getLogger;
// Import at runtime; types may not be present in this environment
var winston = require('winston');
var logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(winston.format.timestamp(), winston.format.printf(function (info) { return "".concat(info.timestamp, " [").concat(info.level, "] ").concat(info.message); })),
    transports: [new winston.transports.Console()],
});
function getLogger() {
    return logger;
}
