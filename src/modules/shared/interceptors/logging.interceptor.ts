import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';

export class LoggingInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const now = Date.now();
    return next.handle().pipe(
      tap(() => {
        const request = context
          .switchToHttp()
          .getRequest<{ method: string; url: string }>();
        const method = request.method;
        const url = request.url;
        const response = context
          .switchToHttp()
          .getResponse<{ statusCode: number }>();
        const statusCode = response.statusCode;
        const responseTime = Date.now() - now;
        console.log(`(${method} ${url} ${statusCode} ${responseTime}ms`);
      }),
    );
  }
}
