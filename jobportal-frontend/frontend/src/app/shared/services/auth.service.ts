import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AuthResponse, LoginRequest, RegisterRequest } from '../models/models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly BASE = 'https://online-job-portal-9.onrender.com/api/auth';
  private _user$ = new BehaviorSubject<AuthResponse | null>(this.loadUser());

  currentUser$ = this._user$.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  login(req: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.BASE}/login`, req).pipe(
      tap(res => this.storeUser(res))
    );
  }

  register(req: RegisterRequest): Observable<any> {
    return this.http.post<any>(`${this.BASE}/register`, req);
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this._user$.next(null);
    this.router.navigate(['/auth/login']);
  }

  private storeUser(res: AuthResponse): void {
    localStorage.setItem('token', res.token);
    localStorage.setItem('currentUser', JSON.stringify(res));
    this._user$.next(res);
  }

  private loadUser(): AuthResponse | null {
    try {
      const raw = localStorage.getItem('currentUser');
      if (!raw) return null;
      const user = JSON.parse(raw) as AuthResponse;
      if (this.isExpired(user.token)) { this.clearStorage(); return null; }
      return user;
    } catch { return null; }
  }

  private isExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch { return true; }
  }

  private clearStorage(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
  }

  get currentUser(): AuthResponse | null { return this._user$.value; }
  get token(): string | null { return localStorage.getItem('token'); }
  get role(): string | null { return this.currentUser?.role ?? null; }
  get userId(): number | null { return this.currentUser?.userId ?? null; }
  get email(): string | null { return this.currentUser?.email ?? null; }

  isLoggedIn(): boolean {
    const t = this.token;
    return !!t && !this.isExpired(t);
  }
  isRole(r: string): boolean { return this.role === r; }
}
