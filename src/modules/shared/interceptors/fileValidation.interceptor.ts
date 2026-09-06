import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { unlink } from 'fs';
import { Request } from 'express';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable()
export class FileValidationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err: unknown) => {
        if (err instanceof BadRequestException) {
          const request = context.switchToHttp().getRequest<Request>();
          const file = (request as Request & { file?: { path: string } }).file;
          if (file) {
            unlink(file.path, (unlinkErr) => {
              if (unlinkErr) console.error('Error removing file:', unlinkErr);
            });
          }
        }
        return throwError(() => {
          throw err;
        });
      }),
    );
  }
}
