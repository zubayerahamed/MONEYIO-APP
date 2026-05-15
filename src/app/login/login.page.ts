import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IonButton, IonContent, IonIcon, IonInput, IonText } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { lockClosedOutline, logInOutline, mailOutline } from 'ionicons/icons';
import { AuthService } from '../services/auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
    standalone: true,
    imports: [
        IonContent,
        IonInput,
        IonButton,
        IonIcon,
        IonText,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterLink
    ]
})
export class LoginPage implements OnInit {
    loginForm: FormGroup;
    errorMessage: string = '';

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router
    ) {
        addIcons({ mailOutline, lockClosedOutline, logInOutline });
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }

    ngOnInit() { }

    onLogin() {
        if (this.loginForm.valid) {
            const { email, password } = this.loginForm.value;
            if (this.authService.login(email, password)) {
                this.router.navigate(['/']);
            } else {
                this.errorMessage = 'Invalid email or password';
            }
        } else {
            this.errorMessage = 'Please fill in all fields correctly';
        }
    }
}
