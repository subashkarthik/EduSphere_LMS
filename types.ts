
export enum UserRole {
  ADMIN = 'ADMIN',
  FACULTY = 'FACULTY',
  STUDENT = 'STUDENT',
  FINANCE = 'FINANCE',
  REGISTRAR = 'REGISTRAR'
}

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  department?: string;
  avatar: string;
  enrollmentNo?: string;
  designation?: string;
}

export interface NavItem {
  id: string;
  label: string;
  icon: string;
  roles: UserRole[];
  category: 'core' | 'academic' | 'admin' | 'auxiliary';
}

export interface DashboardMetric {
  label: string;
  value: string | number;
  change: string;
  trend: 'up' | 'down' | 'neutral';
}

export interface AttendanceRecord {
  courseCode: string;
  courseName: string;
  percentage: number;
  classesHeld: number;
  classesAttended: number;
}

export interface TimetableEntry {
  day: string;
  time: string;
  course: string;
  venue: string;
  faculty?: string;
}

export interface PlacementStats {
  year: string;
  placed: number;
  total: number;
  avgLPA: number;
}

export interface LibraryBook {
  id: string;
  title: string;
  author: string;
  status: 'available' | 'issued' | 'reserved';
  dueDate?: string;
}

export interface FeeRecord {
  semester: string;
  total: number;
  paid: number;
  status: 'fully_paid' | 'partial' | 'pending';
}
