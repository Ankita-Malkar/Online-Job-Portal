import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { JobCardComponent } from '../../../shared/components/job-card/job-card.component';
import { JobService } from '../../../shared/services/job.service';
import { AuthService } from '../../../shared/services/auth.service';
import { Job } from '../../../shared/models/models';

@Component({
  selector: 'app-my-jobs',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent, LoaderComponent, JobCardComponent],
  template: `
    <div class="app-layout">
      <app-sidebar [navItems]="nav"></app-sidebar>
      <div class="main-content">
        <div class="page-container">
          <div class="page-header" style="display:flex;justify-content:space-between;align-items:flex-start">
            <div><h1>My Jobs</h1><p>{{ jobs.length }} job(s) posted</p></div>
            <a routerLink="/employer/add-job" class="btn btn-primary">➕ Post New Job</a>
          </div>

          <app-loader *ngIf="loading" message="Loading your jobs…"></app-loader>

          <div *ngIf="!loading && jobs.length === 0" class="empty-state">
            <div class="empty-icon">📭</div>
            <h3>No jobs posted yet</h3>
            <p>Start attracting talent by posting your first job</p>
            <a routerLink="/employer/add-job" class="btn btn-primary mt-4" style="margin-top:16px">Post a Job</a>
          </div>

          <div *ngIf="!loading && jobs.length > 0"
               style="display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:20px">
            <app-job-card *ngFor="let job of jobs"
              [job]="job" [showDelete]="true" [showViewApps]="true"
              (delete)="deleteJob($event)" (viewApps)="viewApps($event)">
            </app-job-card>
          </div>

          <div class="toast" [class.show]="toastMsg"
               [style.background]="toastError ? 'var(--danger)' : '#1a1a1a'">{{ toastMsg }}</div>
        </div>
      </div>
    </div>
  `,
  styles: [`.toast{position:fixed;bottom:24px;right:24px;color:#fff;padding:12px 20px;
    border-radius:var(--radius);font-size:14px;opacity:0;transform:translateY(10px);
    transition:all 0.3s;pointer-events:none;z-index:9999}.toast.show{opacity:1;transform:translateY(0)}`]
})
export class MyJobsComponent implements OnInit {
  nav = [
    { label: 'Dashboard', icon: '🏠', route: '/employer' },
    { label: 'Post Job', icon: '➕', route: '/employer/add-job' },
    { label: 'My Jobs', icon: '📋', route: '/employer/my-jobs' },
    { label: 'Applications', icon: '👥', route: '/employer/applications' }
  ];
  loading = true; jobs: Job[] = []; toastMsg = ''; toastError = false;

  constructor(private jobSvc: JobService, private auth: AuthService) {}

  ngOnInit() {
    this.jobSvc.getJobsByEmployer(this.auth.userId!).subscribe({
      next: j => { this.jobs = j; this.loading = false; },
      error: () => this.loading = false
    });
  }

  deleteJob(jobId: number) {
    if (!confirm('Delete this job posting?')) return;
    this.jobSvc.deleteJob(jobId).subscribe({
      next: () => { this.jobs = this.jobs.filter(j => j.id !== jobId); this.showToast('Job deleted', false); },
      error: () => this.showToast('Failed to delete job', true)
    });
  }

  viewApps(jobId: number) {
    this.showToast(`View applications for job #${jobId} in the Applications tab`, false);
  }

  showToast(msg: string, err: boolean) { this.toastMsg = msg; this.toastError = err; setTimeout(() => this.toastMsg = '', 3000); }
}
