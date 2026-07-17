import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import type { Response } from 'express';
import type { Observable } from 'rxjs';
import { finalize } from 'rxjs';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, T> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<T> {
    const startedAt = Date.now();
    const response = context.switchToHttp().getResponse<Response>();

    return next.handle().pipe(
      finalize(() => {
        if (!response.headersSent) {
          response.setHeader('X-Response-Time', `${Date.now() - startedAt}ms`);
        }
      }),
    );
  }
}
