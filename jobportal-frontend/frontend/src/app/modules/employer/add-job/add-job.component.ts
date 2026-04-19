import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { JobService } from '../../../shared/services/job.service';
import { AuthService } from '../../../shared/services/auth.service';
import { Category } from '../../../shared/models/models';

@Component({
  selector: 'app-add-job',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, SidebarComponent],
  template: `
    <div class="app-layout">
      <app-sidebar [navItems]="nav"></app-sidebar>
      <div class="main-content">
        <div class="page-container">
          <div class="page-header"><h1>Post a New Job</h1><p>Attract the best candidates</p></div>

          <div style="display:flex;gap:24px;align-items:flex-start">
            <div class="card flex-1">
              <div class="card-header"><h3>Job Details</h3></div>
              <div class="card-body">

                <div *ngIf="success" class="alert alert-success mb-4">
                  ✅ Job posted! <a routerLink="/employer/my-jobs">View my jobs</a>
                </div>
                <div *ngIf="error" class="alert alert-danger mb-4">⚠️ {{ error }}</div>
                <div *ngIf="catError" class="alert alert-warning mb-4">
                  ⚠️ {{ catError }}
                  <button class="btn btn-sm btn-secondary" style="margin-left:10px" (click)="loadCategories()">Retry</button>
                </div>

                <form [formGroup]="form" (ngSubmit)="onSubmit()" novalidate>

                  <div class="form-group">
                    <label>Job Title *</label>
                    <input formControlName="title" class="form-control" placeholder="e.g. Senior Frontend Developer">
                    <span class="field-error" *ngIf="f['title'].invalid && f['title'].touched">Title is required</span>
                  </div>

                  <div class="form-group">
                    <label>Description *</label>
                    <textarea formControlName="description" class="form-control" rows="5"
                              placeholder="Describe responsibilities, requirements"></textarea>
                    <span class="field-error" *ngIf="f['description'].invalid && f['description'].touched">Description is required</span>
                  </div>

                  <div class="grid-2">
                    <div class="form-group">
                      <label>Location *</label>
                      <input formControlName="location" class="form-control" placeholder="Mumbai, Remote">
                      <span class="field-error" *ngIf="f['location'].invalid && f['location'].touched">Required</span>
                    </div>
                    <div class="form-group">
                      <label>Annual Salary (Rs) *</label>
                      <input type="number" formControlName="salary" class="form-control" placeholder="600000">
                      <span class="field-error" *ngIf="f['salary'].invalid && f['salary'].touched">Valid salary required</span>
                    </div>
                  </div>

                  <div class="form-group">
                    <label>Category *
                      <span *ngIf="catLoading" style="font-size:11px;color:var(--text-3);font-weight:400"> loading...</span>
                    </label>
                    <select formControlName="categoryId" class="form-control">
                      <option value="">
                        {{ catLoading ? 'Loading categories...' : (categories.length === 0 ? 'No categories found - ask Admin to add some' : '-- Select a category --') }}
                      </option>
                      <option *ngFor="let c of categories" [value]="c.id.toString()">{{ c.name }}</option>
                    </select>
                    <span class="field-error" *ngIf="f['categoryId'].invalid && f['categoryId'].touched">Please select a category</span>
                    <span *ngIf="!catLoading && categories.length > 0"
                          style="font-size:11px;color:var(--success);margin-top:4px;display:block">
                      {{ categories.length }} categories available
                    </span>
                    <span *ngIf="!catLoading && categories.length === 0 && !catError"
                          style="font-size:11px;color:var(--danger);margin-top:4px;display:block">
                      No categories found. Login as Admin and add categories first.
                    </span>
                  </div>

                  <button type="submit" class="btn btn-primary btn-lg" [disabled]="loading || catLoading">
                    <span *ngIf="loading" class="btn-spinner"></span>
                    {{ loading ? 'Posting...' : 'Post Job' }}
                  </button>

                </form>
              </div>
            </div>

            <div class="card" style="width:220px;flex-shrink:0">
              <div class="card-header"><h3>Tips</h3></div>
              <div class="card-body">
                <ul style="list-style:none;display:flex;flex-direction:column;gap:12px">
                  <li style="font-size:13px;color:var(--text-2);padding-left:18px;position:relative">
                    <span style="position:absolute;left:0;color:var(--success);font-weight:700">v</span>
                    Clear, specific job title
                  </li>
                  <li style="font-size:13px;color:var(--text-2);padding-left:18px;position:relative">
                    <span style="position:absolute;left:0;color:var(--success);font-weight:700">v</span>
                    List required skills clearly
                  </li>
                  <li style="font-size:13px;color:var(--text-2);padding-left:18px;position:relative">
                    <span style="position:absolute;left:0;color:var(--success);font-weight:700">v</span>
                    Set a competitive salary
                  </li>
                </ul>
                <div style="margin-top:16px;padding-top:12px;border-top:1px solid var(--border)">
                  <div style="font-size:10px;color:var(--text-3);font-weight:700;margin-bottom:6px">CATEGORY STATUS</div>
                  <div style="font-size:12px">
                    <span *ngIf="catLoading" style="color:var(--text-2)">Loading...</span>
                    <span *ngIf="!catLoading && categories.length > 0" style="color:var(--success)">{{ categories.length }} ready</span>
                    <span *ngIf="!catLoading && categories.length === 0" style="color:var(--danger)">
                      None loaded. Add as Admin first.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AddJobComponent implements OnInit {
  nav = [
    { label: 'Dashboard', icon: '🏠', route: '/employer' },
    { label: 'Post Job', icon: '+', route: '/employer/add-job' },
    { label: 'My Jobs', icon: '📋', route: '/employer/my-jobs' },
    { label: 'Applications', icon: '👥', route: '/employer/applications' }
  ];

  form = this.fb.group({
    title:       ['', Validators.required],
    description: ['', Validators.required],
    location:    ['', Validators.required],
    salary:      [null as number | null, [Validators.required, Validators.min(1)]],
    categoryId:  ['', Validators.required]
  });

  categories: Category[] = [];
  loading    = false;
  catLoading = false;
  catError   = '';
  success    = false;
  error      = '';

  get f() { return this.form.controls; }

  constructor(
    private fb: FormBuilder,
    private jobSvc: JobService,
    public auth: AuthService
  ) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.catLoading = true;
    this.catError   = '';
    this.categories = [];

    this.jobSvc.getCategories().subscribe({
      next: cats => {
        this.categories = cats;
        this.catLoading = false;
        console.log('Categories loaded:', cats);
      },
      error: err => {
        this.catLoading = false;
        const status = err?.status;
        if (status === 403 || status === 401) {
          this.catError = 'Unauthorized - JWT token may be invalid. Try logging out and back in.';
        } else if (status === 0) {
          this.catError = 'Cannot reach backend. Make sure Spring Boot is running on port 8083.';
        } else {
          this.catError = err?.error?.message || ('Error ' + status + ' loading categories');
        }
        console.error('Category load failed:', err);
      }
    });
  }

  onSubmit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    this.success = false;
    this.error   = '';
    const v = this.form.value;
    this.jobSvc.addJob({
      title:       v.title!,
      description: v.description!,
      location:    v.location!,
      salary:      v.salary!,
      categoryId:  +v.categoryId!,
      employerId:  this.auth.userId!
    }).subscribe({
      next: () => {
        this.loading = false;
        this.success = true;
        this.form.reset();
      },
      error: err => {
        this.loading = false;
        this.error = err?.error?.message || 'Failed to post job';
      }
    });
  }
}
