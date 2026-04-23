
import React from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  Calendar, 
  Users, 
  CreditCard, 
  GraduationCap, 
  FileText, 
  Briefcase, 
  Settings, 
  HelpCircle,
  Building2,
  Bus,
  Library,
  Megaphone,
  UserPlus,
  ShieldCheck,
  History,
  Archive
} from 'lucide-react';
import { UserRole, NavItem, TimetableEntry, AttendanceRecord, PlacementStats } from './types';

export const ROLE_THEMES = {
  [UserRole.STUDENT]: {
    bg: 'bg-indigo-900',
    primary: 'bg-indigo-600',
    text: 'text-indigo-600',
    accent: 'bg-teal-500',
    accentText: 'text-teal-400',
    hover: 'hover:bg-indigo-800',
    light: 'bg-indigo-50',
    border: 'border-indigo-100',
    gradient: 'from-indigo-600 to-violet-600'
  },
  [UserRole.FACULTY]: {
    bg: 'bg-emerald-950',
    primary: 'bg-emerald-700',
    text: 'text-emerald-700',
    accent: 'bg-lime-500',
    accentText: 'text-lime-400',
    hover: 'hover:bg-emerald-900',
    light: 'bg-emerald-50',
    border: 'border-emerald-100',
    gradient: 'from-emerald-700 to-teal-700'
  },
  [UserRole.ADMIN]: {
    bg: 'bg-slate-950',
    primary: 'bg-rose-800',
    text: 'text-rose-800',
    accent: 'bg-amber-500',
    accentText: 'text-amber-400',
    hover: 'hover:bg-slate-900',
    light: 'bg-rose-50',
    border: 'border-rose-100',
    gradient: 'from-rose-800 to-orange-800'
  }
};

export const NAVIGATION_ITEMS: NavItem[] = [
  // CORE WORKFLOW
  { id: 'dashboard', label: 'Overview', icon: 'LayoutDashboard', roles: [UserRole.ADMIN, UserRole.FACULTY, UserRole.STUDENT], category: 'core' },
  
  // ACADEMIC WORKFLOW
  { id: 'academics', label: 'My Courses', icon: 'BookOpen', roles: [UserRole.FACULTY, UserRole.STUDENT], category: 'academic' },
  { id: 'attendance', label: 'Attendance', icon: 'Users', roles: [UserRole.ADMIN, UserRole.FACULTY, UserRole.STUDENT], category: 'academic' },
  { id: 'timetable', label: 'Class Schedule', icon: 'Calendar', roles: [UserRole.FACULTY, UserRole.STUDENT], category: 'academic' },
  { id: 'exams', label: 'Exams & Results', icon: 'FileText', roles: [UserRole.ADMIN, UserRole.FACULTY, UserRole.STUDENT], category: 'academic' },
  
  // ADMINISTRATIVE WORKFLOW
  { id: 'sis', label: 'Student Mgmt', icon: 'UserPlus', roles: [UserRole.ADMIN, UserRole.REGISTRAR], category: 'admin' },
  { id: 'faculty-mgmt', label: 'Faculty Mgmt', icon: 'ShieldCheck', roles: [UserRole.ADMIN], category: 'admin' },
  { id: 'finance', label: 'Fee Portal', icon: 'CreditCard', roles: [UserRole.ADMIN, UserRole.STUDENT, UserRole.FINANCE], category: 'admin' },
  
  // AUXILIARY SERVICES
  { id: 'library', label: 'Library', icon: 'Library', roles: [UserRole.STUDENT, UserRole.FACULTY], category: 'auxiliary' },
  { id: 'placements', label: 'Placements', icon: 'Briefcase', roles: [UserRole.ADMIN, UserRole.STUDENT], category: 'auxiliary' },
  { id: 'announcements', label: 'Notice Board', icon: 'Megaphone', roles: [UserRole.ADMIN, UserRole.FACULTY, UserRole.STUDENT], category: 'auxiliary' },
  
  // SYSTEM
  { id: 'logs', label: 'System Logs', icon: 'History', roles: [UserRole.ADMIN], category: 'core' },
  { id: 'settings', label: 'Preferences', icon: 'Settings', roles: [UserRole.ADMIN, UserRole.FACULTY, UserRole.STUDENT], category: 'core' },
];

export const ICON_MAP: Record<string, any> = {
  LayoutDashboard, BookOpen, Calendar, Users, CreditCard, GraduationCap, FileText, Briefcase, Settings, HelpCircle, Building2, Bus, Library, Megaphone, UserPlus, ShieldCheck, History, Archive
};

export const MOCK_TIMETABLE: TimetableEntry[] = [
  { day: 'Monday', time: '09:00 - 10:00', course: 'Advanced Algorithms', venue: 'LH-302', faculty: 'Dr. Arun Kumar' },
  { day: 'Monday', time: '10:15 - 11:15', course: 'Computer Networks', venue: 'Lab-1', faculty: 'Prof. S. Devi' },
  { day: 'Tuesday', time: '09:00 - 11:00', course: 'Operating Systems Lab', venue: 'Lab-4', faculty: 'Dr. P. Raj' },
  { day: 'Wednesday', time: '11:30 - 12:30', course: 'Web Engineering', venue: 'LH-101', faculty: 'Mrs. K. Priya' },
];

export const MOCK_ATTENDANCE: AttendanceRecord[] = [
  { courseCode: 'CS8701', courseName: 'Cloud Computing', percentage: 92, classesHeld: 45, classesAttended: 42 },
  { courseCode: 'CS8702', courseName: 'Cyber Security', percentage: 85, classesHeld: 40, classesAttended: 34 },
  { courseCode: 'CS8703', courseName: 'Mobile App Development', percentage: 78, classesHeld: 38, classesAttended: 30 },
  { courseCode: 'CS8704', courseName: 'Machine Learning', percentage: 95, classesHeld: 42, classesAttended: 40 },
];

export const PLACEMENT_STATS: PlacementStats[] = [
  { year: '2021', placed: 450, total: 520, avgLPA: 5.5 },
  { year: '2022', placed: 485, total: 540, avgLPA: 6.2 },
  { year: '2023', placed: 512, total: 560, avgLPA: 7.1 },
  { year: '2024', placed: 545, total: 600, avgLPA: 8.5 },
];
