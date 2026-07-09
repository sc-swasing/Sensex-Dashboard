import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  loginForm: FormGroup;
  loading = false;
  errorMsg = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {

    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.errorMsg = '';

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({

      next: (response: { token: string }) => {
        this.loading = false;

        // Store JWT token in browser
        localStorage.setItem('jwt', response.token);

        // Navigate to Dashboard
        this.router.navigate(['/dashboard']);
      },

      error: (err: { status: number }) => {
        this.loading = false;
        console.error(err);
        this.errorMsg = 'Invalid Email or Password';
      }

    });

  }

}