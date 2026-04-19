import { Routes } from '@angular/router';
import { authGuard } from './shared/guards/auth.guard';
import { roleGuard } from './shared/guards/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },

  // ── Auth ───────────────────────────────────────────────
  {
    path: 'auth',
    children: [
      { path: 'login', loadComponent: () => import('./modules/auth/login/login.component').then(m => m.LoginComponent) },
      { path: 'register', loadComponent: () => import('./modules/auth/register/register.component').then(m => m.RegisterComponent) },
      { path: '', redirectTo: 'login', pathMatch: 'full' }
    ]
  },

  // ── Employee ───────────────────────────────────────────
  {
    path: 'employee',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['EMPLOYEE'] },
    children: [
      { path: '', loadComponent: () => import('./modules/employee/dashboard/employee-dashboard.component').then(m => m.EmployeeDashboardComponent) },
      { path: 'jobs', loadComponent: () => import('./modules/employee/jobs/employee-jobs.component').then(m => m.EmployeeJobsComponent) },
      { path: 'my-applications', loadComponent: () => import('./modules/employee/my-applications/my-applications.component').then(m => m.MyApplicationsComponent) },
      { path: 'profile', loadComponent: () => import('./modules/employee/profile/employee-profile.component').then(m => m.EmployeeProfileComponent) }
    ]
  },

  // ── Employer ───────────────────────────────────────────
  {
    path: 'employer',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['EMPLOYER'] },
    children: [
      { path: '', loadComponent: () => import('./modules/employer/dashboard/employer-dashboard.component').then(m => m.EmployerDashboardComponent) },
      { path: 'add-job', loadComponent: () => import('./modules/employer/add-job/add-job.component').then(m => m.AddJobComponent) },
      { path: 'my-jobs', loadComponent: () => import('./modules/employer/my-jobs/my-jobs.component').then(m => m.MyJobsComponent) },
      { path: 'applications', loadComponent: () => import('./modules/employer/applications/employer-applications.component').then(m => m.EmployerApplicationsComponent) }
    ]
  },

  // ── Admin ──────────────────────────────────────────────
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN'] },
    children: [
      { path: '', loadComponent: () => import('./modules/admin/dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent) },
      { path: 'categories', loadComponent: () => import('./modules/admin/categories/admin-categories.component').then(m => m.AdminCategoriesComponent) },
      { path: 'users', loadComponent: () => import('./modules/admin/users/admin-users.component').then(m => m.AdminUsersComponent) },
      { path: 'jobs', loadComponent: () => import('./modules/admin/jobs/admin-jobs.component').then(m => m.AdminJobsComponent) },
      { path: 'applications', loadComponent: () => import('./modules/admin/applications/admin-applications.component').then(m => m.AdminApplicationsComponent) }
    ]
  },

  { path: '**', redirectTo: '/auth/login' }
];
