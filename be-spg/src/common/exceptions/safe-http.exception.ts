import { HttpException, type HttpStatus } from '@nestjs/common';

/**
 * Marks an explicitly curated 5xx message as safe for API clients.
 * Unexpected server errors remain hidden by the global exception filter.
 */
export class SafeHttpException extends HttpException {
  constructor(message: string, status: HttpStatus) {
    super(message, status);
  }
}
