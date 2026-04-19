import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Job, JobRequest, Category } from '../models/models';

@Injectable({ providedIn: 'root' })
export class JobService {
  private readonly JOB = '/api/job';

  constructor(private http: HttpClient) {}

  getAllJobs(): Observable<Job[]> { return this.http.get<Job[]>(`${this.JOB}/all`); }
  getJobById(id: number): Observable<Job> { return this.http.get<Job>(`${this.JOB}/${id}`); }
  addJob(req: JobRequest): Observable<Job> { return this.http.post<Job>(`${this.JOB}/add`, req); }
  getJobsByEmployer(userId: number): Observable<Job[]> { return this.http.get<Job[]>(`${this.JOB}/employer/${userId}`); }
  deleteJob(jobId: number): Observable<any> { return this.http.delete(`${this.JOB}/delete/${jobId}`); }

  getCategories(): Observable<Category[]> { return this.http.get<Category[]>(`${this.JOB}/category`); }
  addCategory(name: string): Observable<Category> {
    return this.http.post<Category>(`${this.JOB}/category/add`, null,
      { params: new HttpParams().set('name', name) });
  }
  deleteCategory(id: number): Observable<any> { return this.http.delete(`${this.JOB}/category/delete/${id}`); }
}
