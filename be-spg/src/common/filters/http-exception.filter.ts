import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';

import { SafeHttpException } from '../exceptions/safe-http.exception';

type ErrorResponse = {
  message?: string | string[];
};

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();
    const isHttpException = exception instanceof HttpException;
    const statusCode = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    if (!isHttpException) {
      const stack =
        exception instanceof Error ? exception.stack : String(exception);
      this.logger.error('Unhandled application error', stack);
    }

    response.status(statusCode).json({
      statusCode,
      timestamp: new Date().toISOString(),
      path: request.originalUrl,
      message: this.getSafeMessage(exception, statusCode),
    });
  }

  private getSafeMessage(
    exception: unknown,
    statusCode: number,
  ): string | string[] {
    if (statusCode >= 500 && !(exception instanceof SafeHttpException)) {
      return 'Internal server error';
    }

    if (!(exception instanceof HttpException)) {
      return 'Unexpected error';
    }

    const exceptionResponse = exception.getResponse();

    if (typeof exceptionResponse === 'string') {
      return exceptionResponse;
    }

    if (
      typeof exceptionResponse === 'object' &&
      exceptionResponse !== null &&
      'message' in exceptionResponse
    ) {
      const { message } = exceptionResponse as ErrorResponse;
      return message ?? exception.message;
    }

    return exception.message;
  }
}
