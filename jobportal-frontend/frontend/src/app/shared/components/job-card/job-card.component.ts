import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Job } from '../../models/models';

@Component({
  selector: 'app-job-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="job-card">
      <div class="job-card-header">
        <div>
          <div class="job-title">{{ job.title }}</div>
          <div class="job-company">{{ job.employerEmail }}</div>
        </div>
        <span class="job-salary">₹{{ formatSalary(job.salary) }}</span>
      </div>

      <div class="job-meta">
        <span class="job-tag">📍 {{ job.location }}</span>
        <span class="job-tag category">{{ job.categoryName }}</span>
      </div>

      <p style="font-size:13px;color:var(--text-2);margin-bottom:14px;
                display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">
        {{ job.description }}
      </p>

      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <button *ngIf="showApply" class="btn btn-primary btn-sm"
                [disabled]="applying" (click)="apply.emit(job)">
          <span *ngIf="applying" class="btn-spinner"></span>
          {{ applying ? 'Applying…' : '✅ Apply Now' }}
        </button>
        <button *ngIf="showDelete" class="btn btn-danger btn-sm"
                (click)="delete.emit(job.id)">🗑 Delete</button>
        <button *ngIf="showViewApps" class="btn btn-secondary btn-sm"
                (click)="viewApps.emit(job.id)">👥 View Applications</button>
      </div>
    </div>
  `
})
export class JobCardComponent {
  @Input() job!: Job;
  @Input() showApply = false;
  @Input() showDelete = false;
  @Input() showViewApps = false;
  @Input() applying = false;

  @Output() apply = new EventEmitter<Job>();
  @Output() delete = new EventEmitter<number>();
  @Output() viewApps = new EventEmitter<number>();

  formatSalary(s: number): string {
    if (!s) return '—';
    if (s >= 100000) return (s / 100000).toFixed(1) + 'L/yr';
    return s.toLocaleString('en-IN') + '/yr';
  }
}
