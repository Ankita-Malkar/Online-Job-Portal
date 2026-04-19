import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, UserProfile, ProfileUpdateRequest, Skill, Education, Experience } from '../models/models';

@Injectable({ providedIn: 'root' })
export class UserApiService {
  private readonly BASE = '/api/auth';
  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<User[]> { return this.http.get<User[]>(`${this.BASE}/all`); }
  getUsersByRole(role: string): Observable<User[]> { return this.http.get<User[]>(`${this.BASE}/role/${role}`); }

  getProfile(userId: number): Observable<UserProfile> { return this.http.get<UserProfile>(`${this.BASE}/profile/${userId}`); }
  updateProfile(req: ProfileUpdateRequest): Observable<UserProfile> { return this.http.put<UserProfile>(`${this.BASE}/profile/update`, req); }

  getSkills(userId: number): Observable<Skill[]> { return this.http.get<Skill[]>(`${this.BASE}/skill/${userId}`); }
  addSkill(userId: number, skillName: string): Observable<Skill> { return this.http.post<Skill>(`${this.BASE}/skill/add`, { userId, skillName }); }
  deleteSkill(id: number): Observable<any> { return this.http.delete(`${this.BASE}/skill/${id}`); }

  getEducation(userId: number): Observable<Education[]> { return this.http.get<Education[]>(`${this.BASE}/education/${userId}`); }
  addEducation(req: any): Observable<Education> { return this.http.post<Education>(`${this.BASE}/education/add`, req); }
  deleteEducation(id: number): Observable<any> { return this.http.delete(`${this.BASE}/education/${id}`); }

  getExperience(userId: number): Observable<Experience[]> { return this.http.get<Experience[]>(`${this.BASE}/experience/${userId}`); }
  addExperience(req: any): Observable<Experience> { return this.http.post<Experience>(`${this.BASE}/experience/add`, req); }
  deleteExperience(id: number): Observable<any> { return this.http.delete(`${this.BASE}/experience/${id}`); }
}
