import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { AuthService } from '../../../shared/services/auth.service';
import { JobService } from '../../../shared/services/job.service';
import { ApplicationService } from '../../../shared/services/application.service';

@Component({
  selector: 'app-employee-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent],
  template: `
    <div class="app-layout">
      <app-sidebar [navItems]="nav"></app-sidebar>
      <div class="main-content">
        <div class="page-container">
          <div class="page-header">
            <h1>Welcome back 👋</h1>
            <p>{{ email }} · Job Seeker Dashboard</p>
          </div>

          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon blue">🔍</div>
              <div><div class="stat-val">{{ totalJobs }}</div><div class="stat-lbl">Available Jobs</div></div>
            </div>
            <div class="stat-card">
              <div class="stat-icon green">📋</div>
              <div><div class="stat-val">{{ myApplications }}</div><div class="stat-lbl">My Applications</div></div>
            </div>
            <div class="stat-card">
              <div class="stat-icon purple">✅</div>
              <div><div class="stat-val">{{ activeApps }}</div><div class="stat-lbl">Active Applications</div></div>
            </div>
            <div class="stat-card">
              <div class="stat-icon orange">❌</div>
              <div><div class="stat-val">{{ cancelledApps }}</div><div class="stat-lbl">Cancelled</div></div>
            </div>
          </div>

          <div class="card">
            <div class="card-header"><h3>Quick Actions</h3></div>
            <div class="card-body" style="display:flex;gap:12px;flex-wrap:wrap">
              <a routerLink="/employee/jobs" class="btn btn-primary">🔍 Browse Jobs</a>
              <a routerLink="/employee/my-applications" class="btn btn-secondary">📋 My Applications</a>
              <a routerLink="/employee/profile" class="btn btn-secondary">👤 Edit Profile</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class EmployeeDashboardComponent implements OnInit {
  nav = [
    { label: 'Dashboard', icon: '🏠', route: '/employee' },
    { label: 'Browse Jobs', icon: '🔍', route: '/employee/jobs' },
    { label: 'My Applications', icon: '📋', route: '/employee/my-applications' },
    { label: 'My Profile', icon: '👤', route: '/employee/profile' }
  ];
  email = ''; totalJobs = 0; myApplications = 0; activeApps = 0; cancelledApps = 0;

  constructor(private auth: AuthService, private jobSvc: JobService, private appSvc: ApplicationService) {}

  ngOnInit() {
    this.email = this.auth.email ?? '';
    this.jobSvc.getAllJobs().subscribe({ next: j => this.totalJobs = j.length, error: () => {} });
    this.appSvc.getByUser(this.auth.userId!).subscribe({
      next: apps => {
        this.myApplications = apps.length;
        this.activeApps = apps.filter(a => a.status === 'APPLIED').length;
        this.cancelledApps = apps.filter(a => a.status === 'CANCELLED').length;
      }, error: () => {}
    });
  }
}
