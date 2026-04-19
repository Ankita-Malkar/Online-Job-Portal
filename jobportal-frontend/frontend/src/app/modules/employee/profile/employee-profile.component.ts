import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { UserApiService } from '../../../shared/services/user-api.service';
import { AuthService } from '../../../shared/services/auth.service';
import { UserProfile, Skill, Education, Experience } from '../../../shared/models/models';

@Component({
  selector: 'app-employee-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule, SidebarComponent, LoaderComponent],
  template: `
    <div class="app-layout">
      <app-sidebar [navItems]="nav"></app-sidebar>
      <div class="main-content">
        <div class="page-container">
          <div class="page-header"><h1>My Profile</h1><p>Manage your personal info & resume</p></div>
          <app-loader *ngIf="loading" message="Loading profile…"></app-loader>

          <div *ngIf="!loading" style="display:grid;grid-template-columns:1fr 1fr;gap:24px">

            <!-- Basic Info -->
            <div class="card" style="grid-column:1/-1">
              <div class="card-header"><h3>👤 Basic Information</h3></div>
              <div class="card-body">
                <div *ngIf="profileSaved" class="alert alert-success mb-4">✅ Profile updated!</div>
                <form [formGroup]="profileForm" (ngSubmit)="saveProfile()">
                  <div class="grid-2">
                    <div class="form-group">
                      <label>Full Name</label>
                      <input type="text" formControlName="fullName" class="form-control" placeholder="Your full name">
                    </div>
                    <div class="form-group">
                      <label>Contact Number</label>
                      <input type="text" formControlName="contactNumber" class="form-control" placeholder="+91 98765 43210">
                    </div>
                  </div>
                  <div class="form-group">
                    <label>Bio</label>
                    <textarea formControlName="bio" class="form-control" rows="3" placeholder="Tell employers about yourself…"></textarea>
                  </div>
                  <div class="grid-2">
                    <div class="form-group"><label>City</label><input formControlName="city" class="form-control" placeholder="Mumbai"></div>
                    <div class="form-group"><label>State</label><input formControlName="state" class="form-control" placeholder="Maharashtra"></div>
                  </div>
                  <div class="form-group"><label>Country</label><input formControlName="country" class="form-control" placeholder="India"></div>
                  <div class="form-group"><label>Resume URL</label><input formControlName="resume" class="form-control" placeholder="https://drive.google.com/…"></div>
                  <button type="submit" class="btn btn-primary" [disabled]="savingProfile">
                    <span *ngIf="savingProfile" class="btn-spinner"></span>
                    {{ savingProfile ? 'Saving…' : '💾 Save Profile' }}
                  </button>
                </form>
              </div>
            </div>

            <!-- Skills -->
            <div class="card">
              <div class="card-header"><h3>🛠 Skills</h3></div>
              <div class="card-body">
                <div style="display:flex;gap:8px;margin-bottom:16px">
                  <input [(ngModel)]="newSkill" class="form-control" placeholder="e.g. Angular, Java…">
                  <button class="btn btn-primary" (click)="addSkill()" [disabled]="!newSkill.trim()">Add</button>
                </div>
                <div style="display:flex;flex-wrap:wrap;gap:8px">
                  <span *ngFor="let s of skills"
                        style="background:var(--primary-light);color:var(--primary);padding:5px 12px;
                               border-radius:99px;font-size:13px;font-weight:500;display:flex;align-items:center;gap:6px">
                    {{ s.skillName }}
                    <button (click)="deleteSkill(s.id)"
                            style="background:none;border:none;cursor:pointer;color:var(--primary);font-size:14px;line-height:1">×</button>
                  </span>
                  <span *ngIf="skills.length===0" style="color:var(--text-3);font-size:13px">No skills added yet</span>
                </div>
              </div>
            </div>

            <!-- Education -->
            <div class="card">
              <div class="card-header"><h3>🎓 Education</h3></div>
              <div class="card-body">
                <form [formGroup]="eduForm" (ngSubmit)="addEducation()" style="margin-bottom:16px">
                  <div class="form-group"><input formControlName="degree" class="form-control" placeholder="Degree e.g. B.Tech CSE"></div>
                  <div class="form-group"><input formControlName="institution" class="form-control" placeholder="Institution name"></div>
                  <div style="display:flex;gap:8px">
                    <input formControlName="year" class="form-control" placeholder="Year e.g. 2020-2024" style="flex:1">
                    <button type="submit" class="btn btn-primary" [disabled]="eduForm.invalid">Add</button>
                  </div>
                </form>
                <div *ngFor="let e of education"
                     style="padding:10px;border:1px solid var(--border);border-radius:var(--radius);margin-bottom:8px;
                            display:flex;justify-content:space-between;align-items:center">
                  <div>
                    <div style="font-weight:600;font-size:13.5px">{{ e.degree }}</div>
                    <div style="font-size:12px;color:var(--text-2)">{{ e.institution }} · {{ e.year }}</div>
                  </div>
                  <button (click)="deleteEducation(e.id)" class="btn btn-ghost btn-sm">🗑</button>
                </div>
                <p *ngIf="education.length===0" style="color:var(--text-3);font-size:13px">No education added yet</p>
              </div>
            </div>

            <!-- Experience -->
            <div class="card" style="grid-column:1/-1">
              <div class="card-header"><h3>💼 Work Experience</h3></div>
              <div class="card-body">
                <form [formGroup]="expForm" (ngSubmit)="addExperience()"
                      style="display:grid;grid-template-columns:1fr 1fr 1fr auto;gap:10px;margin-bottom:16px;align-items:end">
                  <div class="form-group" style="margin:0"><label>Company</label><input formControlName="company" class="form-control" placeholder="Company name"></div>
                  <div class="form-group" style="margin:0"><label>Position</label><input formControlName="position" class="form-control" placeholder="Job title"></div>
                  <div class="form-group" style="margin:0"><label>Duration</label><input formControlName="duration" class="form-control" placeholder="e.g. Jan 2022 - Dec 2023"></div>
                  <button type="submit" class="btn btn-primary" [disabled]="expForm.invalid">Add</button>
                </form>
                <div *ngFor="let ex of experience"
                     style="padding:12px;border:1px solid var(--border);border-radius:var(--radius);
                            margin-bottom:8px;display:flex;justify-content:space-between;align-items:center">
                  <div>
                    <div style="font-weight:600;font-size:13.5px">{{ ex.position }} at {{ ex.company }}</div>
                    <div style="font-size:12px;color:var(--text-2)">{{ ex.duration }}</div>
                  </div>
                  <button (click)="deleteExperience(ex.id)" class="btn btn-ghost btn-sm">🗑</button>
                </div>
                <p *ngIf="experience.length===0" style="color:var(--text-3);font-size:13px">No experience added yet</p>
              </div>
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
export class EmployeeProfileComponent implements OnInit {
  nav = [
    { label: 'Dashboard', icon: '🏠', route: '/employee' },
    { label: 'Browse Jobs', icon: '🔍', route: '/employee/jobs' },
    { label: 'My Applications', icon: '📋', route: '/employee/my-applications' },
    { label: 'My Profile', icon: '👤', route: '/employee/profile' }
  ];
  loading = true; savingProfile = false; profileSaved = false;
  skills: Skill[] = []; education: Education[] = []; experience: Experience[] = [];
  newSkill = ''; toastMsg = ''; toastError = false;

  profileForm = this.fb.group({ fullName: [''], bio: [''], contactNumber: [''], city: [''], state: [''], country: [''], resume: [''] });
  eduForm = this.fb.group({ degree: [''], institution: [''], year: [''] });
  expForm = this.fb.group({ company: [''], position: [''], duration: [''] });

  constructor(private fb: FormBuilder, private userApi: UserApiService, private auth: AuthService) {}

  ngOnInit() {
    const uid = this.auth.userId!;
    let done = 0;
    const check = () => { if (++done === 4) this.loading = false; };
    this.userApi.getProfile(uid).subscribe({ next: p => { this.profileForm.patchValue(p as any); check(); }, error: () => check() });
    this.userApi.getSkills(uid).subscribe({ next: s => { this.skills = s; check(); }, error: () => check() });
    this.userApi.getEducation(uid).subscribe({ next: e => { this.education = e; check(); }, error: () => check() });
    this.userApi.getExperience(uid).subscribe({ next: e => { this.experience = e; check(); }, error: () => check() });
  }

  saveProfile() {
    this.savingProfile = true;
    this.userApi.updateProfile({ userId: this.auth.userId!, ...this.profileForm.value as any }).subscribe({
      next: () => { this.savingProfile = false; this.profileSaved = true; setTimeout(() => this.profileSaved = false, 3000); },
      error: () => { this.savingProfile = false; this.showToast('Failed to save profile', true); }
    });
  }

  addSkill() {
    if (!this.newSkill.trim()) return;
    this.userApi.addSkill(this.auth.userId!, this.newSkill.trim()).subscribe({
      next: s => { this.skills.push(s); this.newSkill = ''; },
      error: () => this.showToast('Failed to add skill', true)
    });
  }

  deleteSkill(id: number) {
    this.userApi.deleteSkill(id).subscribe({ next: () => this.skills = this.skills.filter(s => s.id !== id), error: () => this.showToast('Failed to delete', true) });
  }

  addEducation() {
    if (this.eduForm.invalid) return;
    this.userApi.addEducation({ userId: this.auth.userId!, ...this.eduForm.value }).subscribe({
      next: e => { this.education.push(e); this.eduForm.reset(); },
      error: () => this.showToast('Failed to add education', true)
    });
  }

  deleteEducation(id: number) {
    this.userApi.deleteEducation(id).subscribe({ next: () => this.education = this.education.filter(e => e.id !== id), error: () => this.showToast('Failed to delete', true) });
  }

  addExperience() {
    if (this.expForm.invalid) return;
    this.userApi.addExperience({ userId: this.auth.userId!, ...this.expForm.value }).subscribe({
      next: e => { this.experience.push(e); this.expForm.reset(); },
      error: () => this.showToast('Failed to add experience', true)
    });
  }

  deleteExperience(id: number) {
    this.userApi.deleteExperience(id).subscribe({ next: () => this.experience = this.experience.filter(e => e.id !== id), error: () => this.showToast('Failed to delete', true) });
  }

  showToast(msg: string, err: boolean) { this.toastMsg = msg; this.toastError = err; setTimeout(() => this.toastMsg = '', 3000); }
}
