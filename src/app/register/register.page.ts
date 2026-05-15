import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IonButton, IonContent, IonIcon, IonInput, IonText } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { lockClosedOutline, mailOutline, personAddOutline } from 'ionicons/icons';
import { AuthService } from '../services/auth.service';

export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) {
        return null;
    }

    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
};

@Component({
    selector: 'app-register',
    templateUrl: './register.page.html',
    styleUrls: ['./register.page.scss'],
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
export class RegisterPage implements OnInit {
    registerForm: FormGroup;
    errorMessage: string = '';

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router
    ) {
        addIcons({ mailOutline, lockClosedOutline, personAddOutline });
        this.registerForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', [Validators.required]]
        }, { validators: passwordMatchValidator });
    }

    ngOnInit() { }

    onRegister() {
        if (this.registerForm.valid) {
            const { email, password } = this.registerForm.value;
            if (this.authService.register(email, password)) {
                this.router.navigate(['/']);
            } else {
                this.errorMessage = 'Registration failed. Please try again.';
            }
        } else {
            this.errorMessage = 'Please fill in all fields correctly';
        }
    }
}
