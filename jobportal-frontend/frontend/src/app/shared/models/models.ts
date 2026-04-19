// ── Auth ─────────────────────────────────────────────────
export interface LoginRequest { email: string; password: string; }
export interface RegisterRequest { email: string; password: string; role: 'EMPLOYEE' | 'EMPLOYER'; }
export interface AuthResponse {
  token: string; userId: number; email: string;
  role: 'EMPLOYEE' | 'EMPLOYER' | 'ADMIN'; message: string;
}

// ── User ─────────────────────────────────────────────────
export interface User { userId: number; email: string; role: string; active: boolean; }

// ── Profile ───────────────────────────────────────────────
export interface UserProfile {
  id?: number; fullName: string; bio: string; contactNumber: string;
  city: string; state: string; country: string; resume: string;
  user?: { userId: number; email: string; };
}
export interface ProfileUpdateRequest extends Partial<UserProfile> { userId: number; }

// ── Category ──────────────────────────────────────────────
export interface Category { id: number; name: string; }

// ── Job ───────────────────────────────────────────────────
export interface Job {
  id: number; title: string; description: string; location: string; salary: number;
  categoryId: number; categoryName?: string; employerId: number; employerEmail?: string;
}
export interface JobRequest {
  title: string; description: string; location: string;
  salary: number; categoryId: number; employerId: number;
}

// ── Application ───────────────────────────────────────────
export interface Application {
  id: number; status: string;
  jobId: number; jobTitle?: string; jobLocation?: string; jobSalary?: number;
  userId: number; userEmail?: string; employerId?: number;
}
export interface ApplyRequest { jobId: number; userId: number; }

// ── Skill / Education / Experience ───────────────────────
export interface Skill { id: number; skillName: string; }
export interface Education { id: number; degree: string; institution: string; year: string; }
export interface Experience { id: number; company: string; position: string; duration: string; }
