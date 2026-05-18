import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { RegisterRequest } from '../register/register-request.model';

@Injectable({
    providedIn: 'root'
})
export class AuthService extends BaseService {
    private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
    public isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();

    constructor(private http: HttpClient) {
        super();
        // Check local storage for existing session if needed
        const auth = localStorage.getItem('auth');
        if (auth === 'true') {
            this.isAuthenticatedSubject.next(true);
        }
    }

    signup(data: RegisterRequest): Observable<any> {
        return this.http.post(`${this.apiUrl}/auth/register`, data);
    }

    login(email: string, password: string): boolean {
        // Mock login logic
        if (email && password) {
            this.isAuthenticatedSubject.next(true);
            localStorage.setItem('auth', 'true');
            return true;
        }
        return false;
    }

    register(email: string, password: string): boolean {
        // Mock register logic
        if (email && password) {
            // In a real app, you'd save the user to a database
            this.isAuthenticatedSubject.next(true);
            localStorage.setItem('auth', 'true');
            return true;
        }
        return false;
    }

    logout() {
        this.isAuthenticatedSubject.next(false);
        localStorage.removeItem('auth');
    }

    get isAuthenticated(): boolean {
        return this.isAuthenticatedSubject.value;
    }
}
