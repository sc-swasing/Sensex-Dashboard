import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth';
import Toastify from 'toastify-js';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
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

        Toastify({
          text: `<div style="display:flex; align-items:center; gap:10px;">
                   <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #43e97b;"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                   <span>You have successfully logged in!</span>
                 </div>`,
          escapeMarkup: false,
          duration: 3000,
          gravity: "top",
          position: "right",
          className: "premium-toast success",
          style: { background: "transparent", boxShadow: "none" }
        }).showToast();

        // Navigate to Dashboard
        this.router.navigate(['/dashboard']);
      },

      error: (err: { status: number }) => {
        this.loading = false;
        console.error(err);
        this.errorMsg = 'Invalid Email or Password';

        Toastify({
          text: `<div style="display:flex; align-items:center; gap:10px;">
                   <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #f5576c;"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                   <span>Login Failed: Invalid Email or Password</span>
                 </div>`,
          escapeMarkup: false,
          duration: 3000,
          gravity: "top",
          position: "right",
          className: "premium-toast error",
          style: { background: "transparent", boxShadow: "none" }
        }).showToast();
      }

    });

  }

}