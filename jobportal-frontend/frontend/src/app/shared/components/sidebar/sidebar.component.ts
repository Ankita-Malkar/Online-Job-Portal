import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

export interface NavItem { label: string; icon: string; route: string; }

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLinkActive],
  template: `
    <aside class="sidebar">
      <a class="sidebar-brand" routerLink="/">
        <span>💼</span> <span>Job<strong>Portal</strong></span>
      </a>

      <nav class="sidebar-nav">
        <div class="nav-group">
          <div class="nav-group-label">{{ roleLabel }}</div>
          <a *ngFor="let item of navItems"
             class="nav-link"
             [routerLink]="item.route"
             routerLinkActive="active"
             [routerLinkActiveOptions]="{exact: item.route.split('/').length <= 2}">
            <span class="icon">{{ item.icon }}</span>
            <span>{{ item.label }}</span>
          </a>
        </div>
      </nav>

      <div class="sidebar-footer">
        <div class="sidebar-user">
          <div class="user-avatar">{{ initial }}</div>
          <div class="user-info">
            <div class="user-email">{{ email }}</div>
            <div class="user-role">{{ role }}</div>
          </div>
        </div>
        <button class="btn btn-ghost btn-full mt-4" style="margin-top:10px" (click)="logout()">
          🚪 Logout
        </button>
      </div>
    </aside>
  `
})
export class SidebarComponent implements OnInit {
  @Input() navItems: NavItem[] = [];
  roleLabel = '';
  email = '';
  role = '';
  initial = '';

  constructor(private auth: AuthService) {}

  ngOnInit() {
    this.email = this.auth.email ?? '';
    this.role = this.auth.role ?? '';
    this.initial = this.email.charAt(0).toUpperCase();
    this.roleLabel = this.role + ' MENU';
  }

  logout() { this.auth.logout(); }
}
