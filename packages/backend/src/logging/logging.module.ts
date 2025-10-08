import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        // Use pino-pretty in development only
        transport:
          process.env.NODE_ENV !== 'production'
            ? {
              target: 'pino-pretty',
              options: {
                colorize: true,
                translateTime: 'HH:MM:ss.l',
                ignore: 'pid,hostname,req,res,responseTime',
                messageFormat: '[{context}] {msg}',
              },
            }
            : undefined,

        // Custom log message for requests
        customLogLevel: (req, res, err) => {
          if (res.statusCode >= 500 || err) return 'error';
          if (res.statusCode >= 400) return 'warn';
          return 'info';
        },

        // Optional: clean up request logs
        serializers: {
          req(req) {
            return { method: req.method, url: req.url };
          },
          res(res) {
            return { statusCode: res.statusCode };
          },
        },
        customSuccessMessage: (req, res) =>
          `[HTTP] ${req.method} ${req.url} ${res.statusCode}`,
        customErrorMessage: (req, res, err) =>
          `[HTTP] ${req.method} ${req.url} ${res.statusCode} - ${err.message}`,
      },
    }),
  ],
})
export class LoggingModule {}
