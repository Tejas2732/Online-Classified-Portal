import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {

        if (error.status === 401) {
          alert('Session expired. Please login again.');
          localStorage.clear();
          location.href = '/login';
        }

        if (error.error?.message) {
          alert(error.error.message);
        } else {
          alert('Something went wrong');
        }

        return throwError(() => error);
      })
    );
  }
}
