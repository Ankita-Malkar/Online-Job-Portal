import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { JobCardComponent } from '../../../shared/components/job-card/job-card.component';
import { JobService } from '../../../shared/services/job.service';
import { ApplicationService } from '../../../shared/services/application.service';
import { AuthService } from '../../../shared/services/auth.service';
import { Job, Category } from '../../../shared/models/models';

@Component({
  selector: 'app-employee-jobs',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, SidebarComponent, LoaderComponent, JobCardComponent],
  template: `
    <div class="app-layout">
      <app-sidebar [navItems]="nav"></app-sidebar>
      <div class="main-content">
        <div class="page-container">
          <div class="page-header">
            <h1>Browse Jobs</h1>
            <p>{{ filteredJobs.length }} opportunities available</p>
          </div>

          <div class="card mb-6">
            <div class="card-body">
              <div style="display:flex;gap:12px;flex-wrap:wrap">
                <input type="text" [formControl]="searchCtrl" class="form-control"
                       placeholder="🔍 Search by title or location…" style="flex:2;min-width:200px">
                <select [formControl]="categoryCtrl" class="form-control" style="flex:1;min-width:160px">
                  <option value="">All Categories</option>
                  <option *ngFor="let c of categories" [value]="c.id">{{ c.name }}</option>
                </select>
                <button class="btn btn-ghost" (click)="clear()">✕ Clear</button>
              </div>
            </div>
          </div>

          <app-loader *ngIf="loading" message="Loading jobs…"></app-loader>

          <div *ngIf="!loading && filteredJobs.length === 0" class="empty-state">
            <div class="empty-icon">🔍</div>
            <h3>No jobs found</h3>
            <p>Try adjusting your search filters</p>
          </div>

          <div *ngIf="!loading" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:20px">
            <app-job-card *ngFor="let job of filteredJobs"
              [job]="job" [showApply]="auth.isLoggedIn() && auth.isRole('EMPLOYEE')"
              [applying]="applyingId === job.id"
              (apply)="applyToJob($event)">
            </app-job-card>
          </div>

          <div class="toast" [class.show]="toastMsg"
               [style.background]="toastError ? 'var(--danger)' : '#1a1a1a'">{{ toastMsg }}</div>
        </div>
      </div>
    </div>
  `,
  styles: [`.toast{position:fixed;bottom:24px;right:24px;color:#fff;padding:12px 20px;
    border-radius:var(--radius);font-size:14px;font-weight:500;opacity:0;transform:translateY(10px);
    transition:all 0.3s;pointer-events:none;z-index:9999}
    .toast.show{opacity:1;transform:translateY(0)}`]
})
export class EmployeeJobsComponent implements OnInit {
  nav = [
    { label: 'Dashboard', icon: '🏠', route: '/employee' },
    { label: 'Browse Jobs', icon: '🔍', route: '/employee/jobs' },
    { label: 'My Applications', icon: '📋', route: '/employee/my-applications' },
    { label: 'My Profile', icon: '👤', route: '/employee/profile' }
  ];
  loading = true; jobs: Job[] = []; filteredJobs: Job[] = []; categories: Category[] = [];
  applyingId: number | null = null; toastMsg = ''; toastError = false;
  searchCtrl = new FormControl(''); categoryCtrl = new FormControl('');

  constructor(public auth: AuthService, private jobSvc: JobService, private appSvc: ApplicationService) {}

  ngOnInit() {
    this.loadData();
    this.searchCtrl.valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe(() => this.filter());
    this.categoryCtrl.valueChanges.subscribe(() => this.filter());
  }

  loadData() {
    this.loading = true;
    let done = 0;
    const check = () => { if (++done === 2) { this.loading = false; this.filter(); } };
    this.jobSvc.getAllJobs().subscribe({ next: j => { this.jobs = j; check(); }, error: () => check() });
    this.jobSvc.getCategories().subscribe({ next: c => { this.categories = c; check(); }, error: () => check() });
  }

  filter() {
    const q = (this.searchCtrl.value || '').toLowerCase();
    const cat = this.categoryCtrl.value;
    this.filteredJobs = this.jobs.filter(j => {
      const matchQ = !q || j.title.toLowerCase().includes(q) || (j.location || '').toLowerCase().includes(q);
      const matchCat = !cat || j.categoryId === +cat;
      return matchQ && matchCat;
    });
  }

  clear() { this.searchCtrl.setValue(''); this.categoryCtrl.setValue(''); }

  applyToJob(job: Job) {
    if (!this.auth.isLoggedIn()) { this.showToast('Please login to apply', true); return; }
    this.applyingId = job.id;
    this.appSvc.apply({ jobId: job.id, userId: this.auth.userId! }).subscribe({
      next: () => { this.applyingId = null; this.showToast('Applied successfully! 🎉', false); },
      error: err => { this.applyingId = null; this.showToast(err?.error?.message || 'Already applied or error', true); }
    });
  }

  showToast(msg: string, isError: boolean) {
    this.toastMsg = msg; this.toastError = isError;
    setTimeout(() => this.toastMsg = '', 3500);
  }
}
