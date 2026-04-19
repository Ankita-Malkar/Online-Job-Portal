import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="auth-page">
      <div class="auth-left">
        <div class="auth-brand"><span>💼</span><span>Job<strong>Portal</strong></span></div>
        <div class="auth-hero">
          <h1>Start your journey <span class="serif">today.</span></h1>
          <p>Join thousands of job seekers and employers on JobPortal.</p>
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
            <h2>Create account</h2>
            <p>Join JobPortal for free today</p>
          </div>

          <div *ngIf="error" class="alert alert-danger">⚠️ {{ error }}</div>
          <div *ngIf="success" class="alert alert-success">✅ Registered! Redirecting to login…</div>

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
                       class="form-control" placeholder="Min 6 characters">
                <button type="button" class="pass-toggle" (click)="showPass=!showPass">
                  {{ showPass ? '🙈' : '👁️' }}
                </button>
              </div>
              <span class="field-error" *ngIf="f['password'].invalid && f['password'].touched">
                Password must be at least 6 characters
              </span>
            </div>
            <div class="form-group">
              <label>Register as</label>
              <div style="display:flex;gap:12px;margin-top:6px">
                <label class="role-option" [class.selected]="f['role'].value==='EMPLOYEE'"
                       style="flex:1;border:1.5px solid var(--border);border-radius:var(--radius);
                              padding:12px;cursor:pointer;transition:all 0.15s;text-align:center"
                       [style.border-color]="f['role'].value==='EMPLOYEE' ? 'var(--primary)' : 'var(--border)'"
                       [style.background]="f['role'].value==='EMPLOYEE' ? 'var(--primary-light)' : ''">
                  <input type="radio" formControlName="role" value="EMPLOYEE" style="display:none">
                  <div style="font-size:22px;margin-bottom:4px">👤</div>
                  <div style="font-weight:600;font-size:13px">Job Seeker</div>
                  <div style="font-size:11px;color:var(--text-2)">Find jobs</div>
                </label>
                <label class="role-option" [class.selected]="f['role'].value==='EMPLOYER'"
                       style="flex:1;border:1.5px solid var(--border);border-radius:var(--radius);
                              padding:12px;cursor:pointer;transition:all 0.15s;text-align:center"
                       [style.border-color]="f['role'].value==='EMPLOYER' ? 'var(--primary)' : 'var(--border)'"
                       [style.background]="f['role'].value==='EMPLOYER' ? 'var(--primary-light)' : ''">
                  <input type="radio" formControlName="role" value="EMPLOYER" style="display:none">
                  <div style="font-size:22px;margin-bottom:4px">🏢</div>
                  <div style="font-weight:600;font-size:13px">Employer</div>
                  <div style="font-size:11px;color:var(--text-2)">Post jobs</div>
                </label>
              </div>
            </div>
            <button type="submit" class="btn btn-primary btn-full btn-lg" [disabled]="loading">
              <span *ngIf="loading" class="btn-spinner"></span>
              {{ loading ? 'Creating account…' : 'Create Account' }}
            </button>
          </form>

          <p class="auth-switch">Already have an account? <a routerLink="/auth/login">Sign in</a></p>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    role: ['EMPLOYEE', Validators.required]
  });
  loading = false; error = ''; success = false; showPass = false;
  get f() { return this.form.controls; }

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}

  onSubmit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true; this.error = '';
    const { email, password, role } = this.form.value;
    this.auth.register({ email: email!, password: password!, role: role as any }).subscribe({
      next: () => { this.success = true; this.loading = false; setTimeout(() => this.router.navigate(['/auth/login']), 1500); },
      error: err => { this.loading = false; this.error = err?.error?.message || 'Registration failed.'; }
    });
  }
}
