import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
    public isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();

    constructor() {
        // Check local storage for existing session if needed
        const auth = localStorage.getItem('auth');
        if (auth === 'true') {
            this.isAuthenticatedSubject.next(true);
        }
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
