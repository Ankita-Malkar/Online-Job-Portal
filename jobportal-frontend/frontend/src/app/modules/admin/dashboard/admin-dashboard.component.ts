import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { JobService } from '../../../shared/services/job.service';
import { ApplicationService } from '../../../shared/services/application.service';
import { UserApiService } from '../../../shared/services/user-api.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent],
  template: `
    <div class="app-layout">
      <app-sidebar [navItems]="nav"></app-sidebar>
      <div class="main-content">
        <div class="page-container">
          <div class="page-header"><h1>Admin Dashboard 🛡️</h1><p>System overview and management</p></div>

          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon blue">👥</div>
              <div><div class="stat-val">{{ totalUsers }}</div><div class="stat-lbl">Total Users</div></div>
            </div>
            <div class="stat-card">
              <div class="stat-icon green">💼</div>
              <div><div class="stat-val">{{ totalJobs }}</div><div class="stat-lbl">Total Jobs</div></div>
            </div>
            <div class="stat-card">
              <div class="stat-icon purple">📋</div>
              <div><div class="stat-val">{{ totalApps }}</div><div class="stat-lbl">Applications</div></div>
            </div>
            <div class="stat-card">
              <div class="stat-icon orange">🏷️</div>
              <div><div class="stat-val">{{ totalCats }}</div><div class="stat-lbl">Categories</div></div>
            </div>
          </div>

          <div class="card">
            <div class="card-header"><h3>Admin Actions</h3></div>
            <div class="card-body" style="display:flex;gap:12px;flex-wrap:wrap">
              <a routerLink="/admin/categories" class="btn btn-primary">🏷️ Manage Categories</a>
              <a routerLink="/admin/users" class="btn btn-secondary">👥 View Users</a>
              <a routerLink="/admin/jobs" class="btn btn-secondary">💼 View All Jobs</a>
              <a routerLink="/admin/applications" class="btn btn-secondary">📋 View Applications</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminDashboardComponent implements OnInit {
  nav = [
    { label: 'Dashboard', icon: '🏠', route: '/admin' },
    { label: 'Categories', icon: '🏷️', route: '/admin/categories' },
    { label: 'Users', icon: '👥', route: '/admin/users' },
    { label: 'Jobs', icon: '💼', route: '/admin/jobs' },
    { label: 'Applications', icon: '📋', route: '/admin/applications' }
  ];
  totalUsers = 0; totalJobs = 0; totalApps = 0; totalCats = 0;

  constructor(private jobSvc: JobService, private appSvc: ApplicationService, private userApi: UserApiService) {}

  ngOnInit() {
    this.userApi.getAllUsers().subscribe({ next: u => this.totalUsers = u.length, error: () => {} });
    this.jobSvc.getAllJobs().subscribe({ next: j => this.totalJobs = j.length, error: () => {} });
    this.appSvc.getAll().subscribe({ next: a => this.totalApps = a.length, error: () => {} });
    this.jobSvc.getCategories().subscribe({ next: c => this.totalCats = c.length, error: () => {} });
  }
}
