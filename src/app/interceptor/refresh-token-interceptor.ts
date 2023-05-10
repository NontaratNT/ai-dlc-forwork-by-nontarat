import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, ObservableInput, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { custom } from 'devextreme/ui/dialog';
import { IAccessToken, UserService } from '../services/user.service';
import { CookieStorage } from '../common/cookie';
import Swal from 'sweetalert2';

@Injectable()
export class RefreshTokenInterceptor implements HttpInterceptor {
    private refreshTokenInProgress = false;
    private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

    constructor(private userServ: UserService, private router: Router) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(catchError(_ => this.OnError(req, next, _)));
    }

    private OnError(req: HttpRequest<any>, next: HttpHandler, error: HttpErrorResponse): ObservableInput<any> {
        if (error.status !== 401) {
            return throwError(error);
        } else if (req.url.includes("user/auth")) {
            return throwError(error);
        } else if (req.url.includes("user/refresh")
        || req.url.includes("user/renew")) {
            this.unAuthenticate();
            return throwError(error);
        }


        if (this.refreshTokenInProgress) {
            return this.refreshTokenSubject.pipe(
                filter(r => r !== null),
                take(1),
                switchMap( (_) => {
                    const newHeader = new HttpHeaders({Authorization: "Bearer " + _});
                    return next.handle(req.clone({headers: newHeader}));
                })
            );
        } else {
            this.refreshTokenInProgress = true;
            this.refreshTokenSubject.next(null);

            return this.userServ.refreshToken().pipe(
                switchMap( t => {
                    CookieStorage.accessToken = ({
                        Token: t.Token,
                        RefreshToken: t.RefreshToken
                    } as IAccessToken);

                    this.refreshTokenInProgress = false;
                    this.refreshTokenSubject.next(t.Token);
                    const newHeader = new HttpHeaders({Authorization: "Bearer " + t.Token});
                    return next.handle(req.clone({headers: newHeader}));
                }),
                catchError( _ => {
                    this.refreshTokenInProgress = false;
                    this.unAuthenticate();
                    this.refreshTokenSubject.error(error);
                    return throwError(error);
                })
            );
        }
    }

    private unAuthenticate() {
        Swal.fire({
            title: 'เกิดข้อผิดพลาด!',
            text: 'การเชื่อมต่อหมดอายุ กรุณา login ใหม่',
            icon: 'warning',
            confirmButtonText: 'ตกลง'
        }).then(() => {});
        this.userServ.unAuthenticate();
        this.router.navigate(["/login"]);
    }
}
