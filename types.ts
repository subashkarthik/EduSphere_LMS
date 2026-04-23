
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

export interface LearningMetric {
  id: string;
  user_id: string;
  overall_score: number;
  attendance_score: number;
  assessment_score: number;
  activity_score: number;
  risk_level: 'NORMAL' | 'WARNING' | 'CRITICAL';
  prediction_summary: string;
  updated_at: string;
}

export interface Recommendation {
  id: string;
  type: 'REVISE' | 'PRACTICE' | 'ATTEND' | 'EXPLORE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  title: string;
  message: string;
  link?: string;
}

export interface UserNotification {
  id: string;
  title: string;
  message: string;
  type: 'ALERT' | 'INFO' | 'SUCCESS' | 'WARNING';
  is_read: boolean;
  created_at: string;
}
