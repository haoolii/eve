import winston, { transports } from "winston";

export const logger = winston.createLogger({
  transports: [
    new winston.transports.File({
      filename: "error.log",
      level: "error",
      format: winston.format.json(),
    }),
    new transports.Console({
      level: "info",
      format: winston.format.combine(winston.format.colorize()),
    }),
  ],
});
