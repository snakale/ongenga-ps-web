import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ElectronService } from './electron.service';

@Injectable()
export class WithCredentialsInterceptor implements HttpInterceptor {

    constructor(
      private electronService: ElectronService,
    ) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        

        if (this.electronService.isElectron()) {
          request = request.clone({
            withCredentials: true,
            url: `http://localhost:4000/${request.url}` 
          });
        } else {
          request = request.clone({withCredentials: true});
        }

        /*return next.handle(request).do((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {
              // do stuff with response if you want
            }
          }, (err: any) => {
            if (err instanceof HttpErrorResponse) {
              if (err.status === 401) {
                // redirect to the login route
                // or show a modal
              }
            }
          });*/

        return next.handle(request);
    }
}
