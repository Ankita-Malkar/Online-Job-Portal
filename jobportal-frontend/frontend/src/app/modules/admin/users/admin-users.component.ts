import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { UserApiService } from '../../../shared/services/user-api.service';
import { User } from '../../../shared/models/models';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent, LoaderComponent],
  template: `
    <div class="app-layout">
      <app-sidebar [navItems]="nav"></app-sidebar>
      <div class="main-content">
        <div class="page-container">
          <div class="page-header"><h1>All Users</h1><p>{{ users.length }} registered users</p></div>
          <app-loader *ngIf="loading" message="Loading users…"></app-loader>
          <div *ngIf="!loading" class="card">
            <div class="card-header">
              <h3>Users</h3>
              <div style="display:flex;gap:8px">
                <button class="btn btn-secondary btn-sm" [class.btn-primary]="filter===''" (click)="filter=''">All</button>
                <button class="btn btn-secondary btn-sm" [class.btn-primary]="filter==='EMPLOYEE'" (click)="filter='EMPLOYEE'">Employees</button>
                <button class="btn btn-secondary btn-sm" [class.btn-primary]="filter==='EMPLOYER'" (click)="filter='EMPLOYER'">Employers</button>
              </div>
            </div>
            <div class="table-wrap">
              <table>
                <thead><tr><th>#</th><th>Email</th><th>Role</th><th>Status</th></tr></thead>
                <tbody>
                  <tr *ngFor="let u of filteredUsers; let i = index">
                    <td>{{ i + 1 }}</td>
                    <td>{{ u.email }}</td>
                    <td><span class="badge" [ngClass]="{'badge-info':u.role==='EMPLOYEE','badge-success':u.role==='EMPLOYER','badge-warning':u.role==='ADMIN'}">{{ u.role }}</span></td>
                    <td><span class="badge" [ngClass]="u.active ? 'badge-success' : 'badge-danger'">{{ u.active ? 'Active' : 'Inactive' }}</span></td>
                  </tr>
                  <tr *ngIf="filteredUsers.length===0"><td colspan="4" style="text-align:center;color:var(--text-3)">No users found</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminUsersComponent implements OnInit {
  nav = [
    { label: 'Dashboard', icon: '🏠', route: '/admin' },
    { label: 'Categories', icon: '🏷️', route: '/admin/categories' },
    { label: 'Users', icon: '👥', route: '/admin/users' },
    { label: 'Jobs', icon: '💼', route: '/admin/jobs' },
    { label: 'Applications', icon: '📋', route: '/admin/applications' }
  ];
  loading = true; users: User[] = []; filter = '';
  get filteredUsers() { return this.filter ? this.users.filter(u => u.role === this.filter) : this.users; }
  constructor(private userApi: UserApiService) {}
  ngOnInit() { this.userApi.getAllUsers().subscribe({ next: u => { this.users = u; this.loading = false; }, error: () => this.loading = false }); }
}
