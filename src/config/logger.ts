import winston from "winston";

const customLevels = {
  levels: {
    critical: 0,
    error: 1,
    warn: 2,
    info: 3,
    debug: 4,
  },
  colors: {
    critical: "red",
    error: "red",
    warn: "yellow",
    info: "green",
    debug: "blue",
  },
};

export const logger = winston.createLogger({
  levels: customLevels.levels,
  level: "info",

  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.colorize({ all: true }),
    winston.format.errors({ stack: true }),
    winston.format.json(),
    winston.format.printf(
      (info) => `${info.timestamp} ${info.level}: ${info.message}`,
    ),
  ),

  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "logs/app.log" }),
    new winston.transports.File({
      filename: "logs/errors.log",
      level: "error",
    }),
  ],
});

winston.addColors(customLevels.colors);
