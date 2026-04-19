import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { JobService } from '../../../shared/services/job.service';
import { ApplicationService } from '../../../shared/services/application.service';
import { AuthService } from '../../../shared/services/auth.service';
import { Application, Job } from '../../../shared/models/models';

@Component({
  selector: 'app-employer-applications',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent, LoaderComponent],
  template: `
    <div class="app-layout">
      <app-sidebar [navItems]="nav"></app-sidebar>
      <div class="main-content">
        <div class="page-container">
          <div class="page-header"><h1>Applications Received</h1><p>Review candidates for your job postings</p></div>

          <app-loader *ngIf="loading" message="Loading applications…"></app-loader>

          <div *ngIf="!loading && jobs.length > 0" style="margin-bottom:16px">
            <select class="form-control" style="max-width:320px" (change)="filterByJob($event)">
              <option value="">All Jobs</option>
              <option *ngFor="let j of jobs" [value]="j.id">{{ j.title }}</option>
            </select>
          </div>

          <div *ngIf="!loading && filteredApps.length === 0" class="empty-state">
            <div class="empty-icon">📭</div>
            <h3>No applications yet</h3>
            <p>Post jobs to start receiving applications</p>
          </div>

          <div *ngIf="!loading && filteredApps.length > 0" class="card">
            <div class="card-header"><h3>Applications ({{ filteredApps.length }})</h3></div>
            <div class="table-wrap">
              <table>
                <thead>
                  <tr><th>#</th><th>Candidate</th><th>Job Title</th><th>Status</th><th>Update Status</th></tr>
                </thead>
                <tbody>
                  <tr *ngFor="let a of filteredApps; let i = index">
                    <td>{{ i + 1 }}</td>
                    <td><strong>{{ a.userEmail }}</strong></td>
                    <td>{{ a.jobTitle }}</td>
                    <td>
                      <span class="badge" [ngClass]="{
                        'badge-info': a.status==='APPLIED',
                        'badge-success': a.status==='ACCEPTED',
                        'badge-danger': a.status==='REJECTED'||a.status==='CANCELLED',
                        'badge-warning': a.status==='REVIEWING'
                      }">{{ a.status }}</span>
                    </td>
                    <td>
                      <select class="form-control" style="width:auto;font-size:12px;padding:4px 8px"
                              [value]="a.status" (change)="updateStatus(a, $event)">
                        <option>APPLIED</option>
                        <option>REVIEWING</option>
                        <option>ACCEPTED</option>
                        <option>REJECTED</option>
                      </select>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
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
export class EmployerApplicationsComponent implements OnInit {
  nav = [
    { label: 'Dashboard', icon: '🏠', route: '/employer' },
    { label: 'Post Job', icon: '➕', route: '/employer/add-job' },
    { label: 'My Jobs', icon: '📋', route: '/employer/my-jobs' },
    { label: 'Applications', icon: '👥', route: '/employer/applications' }
  ];
  loading = true; jobs: Job[] = []; allApps: Application[] = []; filteredApps: Application[] = [];
  toastMsg = ''; toastError = false;

  constructor(private jobSvc: JobService, private appSvc: ApplicationService, private auth: AuthService) {}

  ngOnInit() {
    this.jobSvc.getJobsByEmployer(this.auth.userId!).subscribe({
      next: jobs => {
        this.jobs = jobs;
        if (jobs.length === 0) { this.loading = false; return; }
        let done = 0;
        jobs.forEach(j => {
          this.appSvc.getByJob(j.id).subscribe({
            next: apps => {
              this.allApps.push(...apps);
              if (++done === jobs.length) { this.filteredApps = [...this.allApps]; this.loading = false; }
            },
            error: () => { if (++done === jobs.length) { this.filteredApps = [...this.allApps]; this.loading = false; } }
          });
        });
      },
      error: () => this.loading = false
    });
  }

  filterByJob(event: Event) {
    const jobId = +(event.target as HTMLSelectElement).value;
    this.filteredApps = jobId ? this.allApps.filter(a => a.jobId === jobId) : [...this.allApps];
  }

  updateStatus(app: Application, event: Event) {
    const status = (event.target as HTMLSelectElement).value;
    this.appSvc.updateStatus(app.id, status).subscribe({
      next: () => { app.status = status; this.showToast('Status updated', false); },
      error: () => this.showToast('Failed to update', true)
    });
  }

  showToast(msg: string, err: boolean) { this.toastMsg = msg; this.toastError = err; setTimeout(() => this.toastMsg = '', 3000); }
}
