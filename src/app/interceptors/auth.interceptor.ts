import { HttpInterceptorFn } from "@angular/common/http";

const EXCLUDE = [
    '/auth/authenticate',
    '/auth/register'
];

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    if (EXCLUDE.some((url) => req.url.includes(url))) {
        return next(req);
    }

    const token = localStorage.getItem('token');

    if (token) {
        const authReq = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`,
            },
        });
        return next(authReq);
    }

    return next(req);
};