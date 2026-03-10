const winston = require('winston');
const path = require('path');

const isDev = process.env.NODE_ENV !== 'production';

// Формат для консоли (удобно читать в dev-режиме)
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    const metaStr = Object.keys(meta).length ? ' ' + JSON.stringify(meta) : '';
    return `[${timestamp}] ${level}: ${message}${metaStr}`;
  })
);

// Формат для файлов (JSON для удобного парсинга)
const fileFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

const transports = [
  new winston.transports.Console({
    format: consoleFormat,
    level: isDev ? 'debug' : 'info',
    silent: process.env.NODE_ENV === 'test',
  }),
];

// В production добавляем файловые транспорты
if (!isDev) {
  const logsDir = path.join(process.cwd(), 'logs');

  try {
    // Ротация файла ошибок
    const DailyRotateFile = require('winston-daily-rotate-file');

    transports.push(
      new DailyRotateFile({
        filename: path.join(logsDir, 'error-%DATE%.log'),
        datePattern: 'YYYY-MM-DD',
        level: 'error',
        format: fileFormat,
        maxSize: '20m',
        maxFiles: '30d',
        zippedArchive: true,
      }),
      new DailyRotateFile({
        filename: path.join(logsDir, 'combined-%DATE%.log'),
        datePattern: 'YYYY-MM-DD',
        format: fileFormat,
        maxSize: '50m',
        maxFiles: '14d',
        zippedArchive: true,
      })
    );
  } catch {
    // winston-daily-rotate-file может не быть установлен — graceful degradation
  }
}

const logger = winston.createLogger({
  level: isDev ? 'debug' : 'info',
  transports,
  exitOnError: false,
});

/**
 * Middleware для логирования HTTP-запросов
 */
function requestLogger(req, res, next) {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const level = res.statusCode >= 500 ? 'error' : res.statusCode >= 400 ? 'warn' : 'info';

    logger[level](`${req.method} ${req.originalUrl}`, {
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('user-agent'),
    });
  });

  next();
}

module.exports = { logger, requestLogger };
