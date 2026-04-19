import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="auth-page">
      <div class="auth-left">
        <div class="auth-brand"><span>💼</span><span>Job<strong>Portal</strong></span></div>
        <div class="auth-hero">
          <h1>Find your dream job <span class="serif">today.</span></h1>
          <p>Thousands of opportunities across every industry. Your next career move starts here.</p>
        </div>
        <div class="auth-stats">
          <div class="astat"><span class="astat-val">10K+</span><span class="astat-lbl">Jobs Listed</span></div>
          <div class="astat"><span class="astat-val">5K+</span><span class="astat-lbl">Companies</span></div>
          <div class="astat"><span class="astat-val">98%</span><span class="astat-lbl">Success Rate</span></div>
        </div>
      </div>

      <div class="auth-right">
        <div class="auth-card animate-fadeInUp">
          <div class="auth-header">
            <h2>Welcome back</h2>
            <p>Sign in to continue to JobPortal</p>
          </div>

          <div *ngIf="error" class="alert alert-danger">⚠️ {{ error }}</div>

          <form [formGroup]="form" (ngSubmit)="onSubmit()" novalidate>
            <div class="form-group">
              <label>Email Address</label>
              <input type="email" formControlName="email" class="form-control" placeholder="you@example.com">
              <span class="field-error" *ngIf="f['email'].invalid && f['email'].touched">
                {{ f['email'].hasError('required') ? 'Email is required' : 'Enter a valid email' }}
              </span>
            </div>
            <div class="form-group">
              <label>Password</label>
              <div class="pass-wrap">
                <input [type]="showPass ? 'text' : 'password'" formControlName="password"
                       class="form-control" placeholder="••••••••">
                <button type="button" class="pass-toggle" (click)="showPass=!showPass">
                  {{ showPass ? '🙈' : '👁️' }}
                </button>
              </div>
              <span class="field-error" *ngIf="f['password'].invalid && f['password'].touched">
                {{ f['password'].hasError('required') ? 'Password is required' : 'Min 6 characters' }}
              </span>
            </div>
            <button type="submit" class="btn btn-primary btn-full btn-lg" [disabled]="loading">
              <span *ngIf="loading" class="btn-spinner"></span>
              {{ loading ? 'Signing in…' : 'Sign In' }}
            </button>
          </form>

          <p class="auth-switch">Don't have an account? <a routerLink="/auth/register">Create one free</a></p>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });
  loading = false; error = ''; showPass = false;
  get f() { return this.form.controls; }

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}

  onSubmit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true; this.error = '';
    const { email, password } = this.form.value;
    this.auth.login({ email: email!, password: password! }).subscribe({
      next: res => {
        this.loading = false;
        if (res.role === 'ADMIN') this.router.navigate(['/admin']);
        else if (res.role === 'EMPLOYER') this.router.navigate(['/employer']);
        else this.router.navigate(['/employee']);
      },
      error: err => {
        this.loading = false;
        this.error = err?.error?.message || 'Invalid credentials. Please try again.';
      }
    });
  }
}
