import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { ApplicationService } from '../../../shared/services/application.service';
import { Application } from '../../../shared/models/models';

@Component({
  selector: 'app-admin-applications',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent, LoaderComponent],
  template: `
    <div class="app-layout">
      <app-sidebar [navItems]="nav"></app-sidebar>
      <div class="main-content">
        <div class="page-container">
          <div class="page-header"><h1>All Applications</h1><p>{{ apps.length }} total applications</p></div>
          <app-loader *ngIf="loading" message="Loading applications…"></app-loader>
          <div *ngIf="!loading" class="card">
            <div class="card-header"><h3>Applications</h3></div>
            <div class="table-wrap">
              <table>
                <thead>
                  <tr><th>#</th><th>Candidate</th><th>Job Title</th><th>Location</th><th>Status</th></tr>
                </thead>
                <tbody>
                  <tr *ngFor="let a of apps; let i = index">
                    <td>{{ i + 1 }}</td>
                    <td>{{ a.userEmail }}</td>
                    <td><strong>{{ a.jobTitle }}</strong></td>
                    <td>{{ a.jobLocation || '—' }}</td>
                    <td>
                      <span class="badge" [ngClass]="{
                        'badge-info': a.status==='APPLIED',
                        'badge-success': a.status==='ACCEPTED',
                        'badge-danger': a.status==='REJECTED'||a.status==='CANCELLED',
                        'badge-warning': a.status==='REVIEWING'
                      }">{{ a.status }}</span>
                    </td>
                  </tr>
                  <tr *ngIf="apps.length===0">
                    <td colspan="5" style="text-align:center;color:var(--text-3)">No applications yet</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminApplicationsComponent implements OnInit {
  nav = [
    { label: 'Dashboard', icon: '🏠', route: '/admin' },
    { label: 'Categories', icon: '🏷️', route: '/admin/categories' },
    { label: 'Users', icon: '👥', route: '/admin/users' },
    { label: 'Jobs', icon: '💼', route: '/admin/jobs' },
    { label: 'Applications', icon: '📋', route: '/admin/applications' }
  ];
  loading = true; apps: Application[] = [];
  constructor(private appSvc: ApplicationService) {}
  ngOnInit() {
    this.appSvc.getAll().subscribe({
      next: a => { this.apps = a; this.loading = false; },
      error: () => this.loading = false
    });
  }
}
