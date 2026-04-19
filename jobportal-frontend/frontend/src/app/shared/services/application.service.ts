import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Application, ApplyRequest } from '../models/models';

@Injectable({ providedIn: 'root' })
export class ApplicationService {
  private readonly BASE = '/api/application';
  constructor(private http: HttpClient) {}

  apply(req: ApplyRequest): Observable<Application> { return this.http.post<Application>(`${this.BASE}/apply`, req); }
  getByUser(userId: number): Observable<Application[]> { return this.http.get<Application[]>(`${this.BASE}/user/${userId}`); }
  getByJob(jobId: number): Observable<Application[]> { return this.http.get<Application[]>(`${this.BASE}/job/${jobId}`); }
  getAll(): Observable<Application[]> { return this.http.get<Application[]>(`${this.BASE}/all`); }
  cancel(id: number): Observable<any> { return this.http.put(`${this.BASE}/cancel/${id}`, {}); }
  updateStatus(id: number, status: string): Observable<any> {
    return this.http.put(`${this.BASE}/status/${id}`, null, { params: { status } });
  }
}
