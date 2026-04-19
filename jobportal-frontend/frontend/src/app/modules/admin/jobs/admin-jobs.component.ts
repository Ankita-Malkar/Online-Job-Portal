import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { JobService } from '../../../shared/services/job.service';
import { Job } from '../../../shared/models/models';

@Component({
  selector: 'app-admin-jobs',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent, LoaderComponent],
  template: `
    <div class="app-layout">
      <app-sidebar [navItems]="nav"></app-sidebar>
      <div class="main-content">
        <div class="page-container">
          <div class="page-header"><h1>All Jobs</h1><p>{{ jobs.length }} jobs in the system</p></div>
          <app-loader *ngIf="loading" message="Loading jobs…"></app-loader>
          <div *ngIf="!loading" class="card">
            <div class="card-header"><h3>Jobs</h3></div>
            <div class="table-wrap">
              <table>
                <thead><tr><th>#</th><th>Title</th><th>Employer</th><th>Category</th><th>Location</th><th>Salary</th><th>Action</th></tr></thead>
                <tbody>
                  <tr *ngFor="let j of jobs; let i = index">
                    <td>{{ i + 1 }}</td>
                    <td><strong>{{ j.title }}</strong></td>
                    <td>{{ j.employerEmail }}</td>
                    <td><span class="badge badge-info">{{ j.categoryName }}</span></td>
                    <td>{{ j.location }}</td>
                    <td class="text-success font-bold">₹{{ formatSalary(j.salary) }}</td>
                    <td>
                      <button class="btn btn-danger btn-sm" (click)="deleteJob(j)">🗑</button>
                    </td>
                  </tr>
                  <tr *ngIf="jobs.length===0"><td colspan="7" style="text-align:center;color:var(--text-3)">No jobs found</td></tr>
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
export class AdminJobsComponent implements OnInit {
  nav = [
    { label: 'Dashboard', icon: '🏠', route: '/admin' },
    { label: 'Categories', icon: '🏷️', route: '/admin/categories' },
    { label: 'Users', icon: '👥', route: '/admin/users' },
    { label: 'Jobs', icon: '💼', route: '/admin/jobs' },
    { label: 'Applications', icon: '📋', route: '/admin/applications' }
  ];
  loading = true; jobs: Job[] = []; toastMsg = ''; toastError = false;
  constructor(private jobSvc: JobService) {}
  ngOnInit() { this.jobSvc.getAllJobs().subscribe({ next: j => { this.jobs = j; this.loading = false; }, error: () => this.loading = false }); }
  formatSalary(s: number) { return s >= 100000 ? (s/100000).toFixed(1)+'L/yr' : s?.toLocaleString('en-IN')+'/yr'; }
  deleteJob(job: Job) {
    if (!confirm(`Delete "${job.title}"?`)) return;
    this.jobSvc.deleteJob(job.id).subscribe({
      next: () => { this.jobs = this.jobs.filter(j => j.id !== job.id); this.showToast('Job deleted', false); },
      error: () => this.showToast('Failed to delete', true)
    });
  }
  showToast(msg: string, err: boolean) { this.toastMsg = msg; this.toastError = err; setTimeout(() => this.toastMsg = '', 3000); }
}
