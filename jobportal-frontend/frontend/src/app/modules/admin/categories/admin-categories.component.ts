import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { JobService } from '../../../shared/services/job.service';
import { Category } from '../../../shared/models/models';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, SidebarComponent, LoaderComponent],
  template: `
    <div class="app-layout">
      <app-sidebar [navItems]="nav"></app-sidebar>
      <div class="main-content">
        <div class="page-container">
          <div class="page-header"><h1>Job Categories</h1><p>Manage job categories</p></div>

          <div class="card mb-6" style="max-width:500px">
            <div class="card-header"><h3>➕ Add Category</h3></div>
            <div class="card-body">
              <div *ngIf="addError" class="alert alert-danger mb-4">⚠️ {{ addError }}</div>
              <div style="display:flex;gap:10px">
                <input [(ngModel)]="newCatName" class="form-control" placeholder="e.g. Software Engineering"
                       (keyup.enter)="addCategory()">
                <button class="btn btn-primary" (click)="addCategory()" [disabled]="!newCatName.trim() || adding">
                  <span *ngIf="adding" class="btn-spinner"></span>
                  {{ adding ? '…' : 'Add' }}
                </button>
              </div>
            </div>
          </div>

          <app-loader *ngIf="loading" message="Loading categories…"></app-loader>

          <div *ngIf="!loading" class="card">
            <div class="card-header"><h3>All Categories ({{ categories.length }})</h3></div>
            <div class="table-wrap">
              <table>
                <thead><tr><th>#</th><th>Category Name</th><th>Action</th></tr></thead>
                <tbody>
                  <tr *ngFor="let c of categories; let i = index">
                    <td>{{ i + 1 }}</td>
                    <td><strong>{{ c.name }}</strong></td>
                    <td>
                      <button class="btn btn-danger btn-sm" (click)="deleteCategory(c)">🗑 Delete</button>
                    </td>
                  </tr>
                  <tr *ngIf="categories.length === 0">
                    <td colspan="3" style="text-align:center;color:var(--text-3)">No categories yet</td>
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
export class AdminCategoriesComponent implements OnInit {
  nav = [
    { label: 'Dashboard', icon: '🏠', route: '/admin' },
    { label: 'Categories', icon: '🏷️', route: '/admin/categories' },
    { label: 'Users', icon: '👥', route: '/admin/users' },
    { label: 'Jobs', icon: '💼', route: '/admin/jobs' },
    { label: 'Applications', icon: '📋', route: '/admin/applications' }
  ];
  loading = true; categories: Category[] = []; newCatName = ''; adding = false;
  addError = ''; toastMsg = ''; toastError = false;

  constructor(private jobSvc: JobService) {}

  ngOnInit() {
    this.jobSvc.getCategories().subscribe({ next: c => { this.categories = c; this.loading = false; }, error: () => this.loading = false });
  }

  addCategory() {
    if (!this.newCatName.trim()) return;
    this.adding = true; this.addError = '';
    this.jobSvc.addCategory(this.newCatName.trim()).subscribe({
      next: c => { this.categories.push(c); this.newCatName = ''; this.adding = false; this.showToast('Category added!', false); },
      error: err => { this.adding = false; this.addError = err?.error?.message || 'Failed to add category'; }
    });
  }

  deleteCategory(cat: Category) {
    if (!confirm(`Delete "${cat.name}"?`)) return;
    this.jobSvc.deleteCategory(cat.id).subscribe({
      next: () => { this.categories = this.categories.filter(c => c.id !== cat.id); this.showToast('Category deleted', false); },
      error: () => this.showToast('Failed to delete', true)
    });
  }

  showToast(msg: string, err: boolean) { this.toastMsg = msg; this.toastError = err; setTimeout(() => this.toastMsg = '', 3000); }
}
