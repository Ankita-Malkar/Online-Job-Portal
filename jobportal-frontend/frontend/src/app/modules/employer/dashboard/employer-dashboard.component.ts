import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { AuthService } from '../../../shared/services/auth.service';
import { JobService } from '../../../shared/services/job.service';
import { ApplicationService } from '../../../shared/services/application.service';

@Component({
  selector: 'app-employer-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent],
  template: `
    <div class="app-layout">
      <app-sidebar [navItems]="nav"></app-sidebar>
      <div class="main-content">
        <div class="page-container">
          <div class="page-header">
            <h1>Employer Dashboard 🏢</h1>
            <p>{{ email }} · Manage your job postings</p>
          </div>

          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon blue">📋</div>
              <div><div class="stat-val">{{ myJobs }}</div><div class="stat-lbl">My Job Postings</div></div>
            </div>
            <div class="stat-card">
              <div class="stat-icon green">👥</div>
              <div><div class="stat-val">{{ totalApps }}</div><div class="stat-lbl">Total Applications</div></div>
            </div>
            <div class="stat-card">
              <div class="stat-icon purple">✅</div>
              <div><div class="stat-val">{{ activeApps }}</div><div class="stat-lbl">Active Applications</div></div>
            </div>
          </div>

          <div class="card">
            <div class="card-header"><h3>Quick Actions</h3></div>
            <div class="card-body" style="display:flex;gap:12px;flex-wrap:wrap">
              <a routerLink="/employer/add-job" class="btn btn-primary">➕ Post New Job</a>
              <a routerLink="/employer/my-jobs" class="btn btn-secondary">📋 My Jobs</a>
              <a routerLink="/employer/applications" class="btn btn-secondary">👥 Applications</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class EmployerDashboardComponent implements OnInit {
  nav = [
    { label: 'Dashboard', icon: '🏠', route: '/employer' },
    { label: 'Post Job', icon: '➕', route: '/employer/add-job' },
    { label: 'My Jobs', icon: '📋', route: '/employer/my-jobs' },
    { label: 'Applications', icon: '👥', route: '/employer/applications' }
  ];
  email = ''; myJobs = 0; totalApps = 0; activeApps = 0;

  constructor(private auth: AuthService, private jobSvc: JobService, private appSvc: ApplicationService) {}

  ngOnInit() {
    this.email = this.auth.email ?? '';
    this.jobSvc.getJobsByEmployer(this.auth.userId!).subscribe({
      next: jobs => {
        this.myJobs = jobs.length;
        jobs.forEach(j => {
          this.appSvc.getByJob(j.id).subscribe({
            next: apps => {
              this.totalApps += apps.length;
              this.activeApps += apps.filter(a => a.status === 'APPLIED').length;
            }, error: () => {}
          });
        });
      }, error: () => {}
    });
  }
}
