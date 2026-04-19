import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const allowed: string[] = route.data['roles'] ?? [];

  if (!auth.isLoggedIn()) { router.navigate(['/auth/login']); return false; }
  if (!allowed.length || allowed.includes(auth.role ?? '')) return true;

  const role = auth.role;
  if (role === 'ADMIN') router.navigate(['/admin']);
  else if (role === 'EMPLOYER') router.navigate(['/employer']);
  else router.navigate(['/employee']);
  return false;
};
