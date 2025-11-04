import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable()
export class ApiKeyInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    if (req.url.includes('/audio/cleanup')) {
      const cloned = req.clone({
        setHeaders: { 'X-API-Key': environment.adminKey }
      });
      return next.handle(cloned);
    }
    return next.handle(req);
  }
}