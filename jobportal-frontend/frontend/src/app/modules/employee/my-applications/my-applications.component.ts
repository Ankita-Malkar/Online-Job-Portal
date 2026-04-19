import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { ApplicationService } from '../../../shared/services/application.service';
import { AuthService } from '../../../shared/services/auth.service';
import { Application } from '../../../shared/models/models';

@Component({
  selector: 'app-my-applications',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent, LoaderComponent],
  template: `
    <div class="app-layout">
      <app-sidebar [navItems]="nav"></app-sidebar>
      <div class="main-content">
        <div class="page-container">
          <div class="page-header">
            <h1>My Applications</h1>
            <p>Track all your job applications here</p>
          </div>

          <app-loader *ngIf="loading" message="Loading applications…"></app-loader>

          <div *ngIf="!loading && apps.length === 0" class="empty-state">
            <div class="empty-icon">📭</div>
            <h3>No applications yet</h3>
            <p>Browse jobs and apply to get started</p>
            <a routerLink="/employee/jobs" class="btn btn-primary mt-4" style="margin-top:16px">Browse Jobs</a>
          </div>

          <div *ngIf="!loading && apps.length > 0" class="card">
            <div class="card-header"><h3>All Applications ({{ apps.length }})</h3></div>
            <div class="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>#</th><th>Job Title</th><th>Location</th><th>Salary</th><th>Status</th><th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let a of apps; let i = index">
                    <td>{{ i + 1 }}</td>
                    <td><strong>{{ a.jobTitle }}</strong></td>
                    <td>{{ a.jobLocation || '—' }}</td>
                    <td>{{ a.jobSalary ? ('₹' + formatSalary(a.jobSalary)) : '—' }}</td>
                    <td>
                      <span class="badge" [ngClass]="{
                        'badge-info': a.status === 'APPLIED',
                        'badge-success': a.status === 'ACCEPTED',
                        'badge-danger': a.status === 'CANCELLED' || a.status === 'REJECTED',
                        'badge-warning': a.status === 'REVIEWING'
                      }">{{ a.status }}</span>
                    </td>
                    <td>
                      <button *ngIf="a.status === 'APPLIED'" class="btn btn-danger btn-sm"
                              [disabled]="cancellingId === a.id" (click)="cancel(a)">
                        {{ cancellingId === a.id ? '…' : 'Cancel' }}
                      </button>
                      <span *ngIf="a.status !== 'APPLIED'" class="text-muted text-sm">—</span>
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
export class MyApplicationsComponent implements OnInit {
  nav = [
    { label: 'Dashboard', icon: '🏠', route: '/employee' },
    { label: 'Browse Jobs', icon: '🔍', route: '/employee/jobs' },
    { label: 'My Applications', icon: '📋', route: '/employee/my-applications' },
    { label: 'My Profile', icon: '👤', route: '/employee/profile' }
  ];
  loading = true; apps: Application[] = []; cancellingId: number | null = null;
  toastMsg = ''; toastError = false;

  constructor(private appSvc: ApplicationService, private auth: AuthService) {}

  ngOnInit() {
    this.appSvc.getByUser(this.auth.userId!).subscribe({
      next: a => { this.apps = a; this.loading = false; },
      error: () => this.loading = false
    });
  }

  cancel(app: Application) {
    this.cancellingId = app.id;
    this.appSvc.cancel(app.id).subscribe({
      next: () => {
        app.status = 'CANCELLED'; this.cancellingId = null;
        this.showToast('Application cancelled', false);
      },
      error: () => { this.cancellingId = null; this.showToast('Failed to cancel', true); }
    });
  }

  formatSalary(s: number) {
    if (s >= 100000) return (s / 100000).toFixed(1) + 'L/yr';
    return s.toLocaleString('en-IN') + '/yr';
  }

  showToast(msg: string, err: boolean) {
    this.toastMsg = msg; this.toastError = err;
    setTimeout(() => this.toastMsg = '', 3000);
  }
}
