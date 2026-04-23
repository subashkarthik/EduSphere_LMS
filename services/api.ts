/**
 * UniVerse ERP — API Client
 * 
 * Centralized HTTP client for communicating with the FastAPI backend.
 * Handles JWT token management, automatic refresh, and request/response interceptors.
 */

const API_BASE = '/api';

// ---------- Token Storage (in-memory for security) ----------
let accessToken: string | null = null;
let refreshToken: string | null = null;

export const setTokens = (access: string, refresh: string) => {
  accessToken = access;
  refreshToken = refresh;
};

export const clearTokens = () => {
  accessToken = null;
  refreshToken = null;
};

export const getAccessToken = () => accessToken;

// ---------- Core Fetch Wrapper ----------
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
  retry = true
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  // Handle 401 - attempt token refresh
  if (response.status === 401 && retry && refreshToken) {
    const refreshed = await attemptRefresh();
    if (refreshed) {
      return apiFetch<T>(endpoint, options, false);
    }
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Request failed' }));
    throw new Error(error.detail || `HTTP ${response.status}`);
  }

  return response.json();
}

async function attemptRefresh(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!res.ok) return false;

    const data = await res.json();
    setTokens(data.access_token, data.refresh_token);
    return true;
  } catch {
    return false;
  }
}

// ---------- Auth API ----------
export const authApi = {
  login: (email: string, password: string) =>
    apiFetch<{
      access_token: string;
      refresh_token: string;
      token_type: string;
      user: {
        id: string;
        name: string;
        email: string;
        role: string;
        department: string | null;
        avatar: string;
        enrollment_no: string | null;
        designation: string | null;
      };
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  me: () =>
    apiFetch<{
      id: string;
      email: string;
      name: string;
      role: string;
      department: string | null;
      department_id: string | null;
      avatar: string;
      enrollment_no: string | null;
      designation: string | null;
      phone: string | null;
      is_active: boolean;
    }>('/auth/me'),

  logout: () => apiFetch('/auth/logout', { method: 'POST' }),
};

// ---------- Dashboard API ----------
export const dashboardApi = {
  metrics: () =>
    apiFetch<Array<{
      label: string;
      value: string;
      change: string;
      trend: string;
    }>>('/dashboard/metrics'),

  activity: () =>
    apiFetch<Array<{
      label: string;
      description: string;
      time: string;
      type: string;
    }>>('/dashboard/activity'),

  analytics: () =>
    apiFetch<{
      placement_trends: Array<{
        year: string;
        placed: number;
        total: number;
        avgLPA: number;
      }>;
    }>('/dashboard/analytics'),
};

// ---------- Courses API ----------
export const coursesApi = {
  list: () =>
    apiFetch<Array<{
      id: string;
      code: string;
      name: string;
      credits: number;
      faculty_name: string | null;
      schedule: string | null;
      enrolled_count: number;
      progress: number;
    }>>('/courses/'),

  get: (id: string) => apiFetch(`/courses/${id}`),

  materials: (courseId: string) =>
    apiFetch<Array<{
      id: string;
      title: string;
      file_type: string;
      file_size: string;
      uploaded_at: string;
      uploaded_by_name: string | null;
    }>>(`/courses/${courseId}/materials`),
};

// ---------- Attendance API ----------
export const attendanceApi = {
  summary: () =>
    apiFetch<Array<{
      course_code: string;
      course_name: string;
      percentage: number;
      classes_held: number;
      classes_attended: number;
    }>>('/attendance/summary'),

  history: (courseId: string) =>
    apiFetch<Array<{
      date: string;
      status: string;
      time: string;
      faculty: string;
    }>>(`/attendance/history/${courseId}`),

  createSession: (data: { course_id: string; session_date: string }) =>
    apiFetch('/attendance/sessions', { method: 'POST', body: JSON.stringify(data) }),

  markAttendance: (sessionId: string, marks: Array<{ student_id: string; status: string }>) =>
    apiFetch(`/attendance/sessions/${sessionId}/mark`, {
      method: 'POST',
      body: JSON.stringify({ marks }),
    }),
};

// ---------- Exams API ----------
export const examsApi = {
  schedules: () => apiFetch('/exams/schedules/'),
  results: () => apiFetch('/exams/results/'),
  transcripts: () =>
    apiFetch<Array<{
      semester: string;
      courses: Array<{
        course_name: string;
        grade: string;
        credits: number;
      }>;
      sgpa: number;
    }>>('/exams/transcripts/'),
};

// ---------- Finance API ----------
export const financeApi = {
  fees: () =>
    apiFetch<Array<{
      id: string;
      label: string;
      amount: number;
      due_date: string;
      status: string;
      payment_date: string | null;
      semester_label: string;
    }>>('/finance/fees'),

  outstanding: () =>
    apiFetch<{
      total_due: number;
      total_paid: number;
      outstanding: number;
    }>('/finance/outstanding'),

  makePayment: (data: { fee_structure_id: string; amount_paid: number }) =>
    apiFetch('/finance/payments', { method: 'POST', body: JSON.stringify(data) }),

  history: () => apiFetch('/finance/payments/history'),
};

// ---------- Placements API ----------
export const placementsApi = {
  drives: () =>
    apiFetch<Array<{
      id: string;
      company_name: string;
      role_offered: string;
      package_lpa: number;
      drive_date: string;
      status: string;
      application_status: string | null;
    }>>('/placements/drives/'),

  stats: () =>
    apiFetch<Array<{
      year: string;
      placed: number;
      total: number;
      avg_lpa: number;
    }>>('/placements/stats/'),

  apply: (driveId: string) =>
    apiFetch(`/placements/drives/${driveId}/apply`, { method: 'POST' }),
};

// ---------- Timetable API ----------
export const timetableApi = {
  list: () =>
    apiFetch<Array<{
      id: string;
      day: string;
      time: string;
      course: string;
      venue: string;
      faculty: string | null;
      entry_type: string;
    }>>('/timetable/'),
};

// ---------- Announcements API ----------
export const announcementsApi = {
  list: () =>
    apiFetch<Array<{
      id: string;
      title: string;
      content: string;
      author_name: string;
      priority: string;
      is_pinned: boolean;
      published_at: string;
    }>>('/announcements/'),

  create: (data: { title: string; content: string; target_roles?: string; priority?: string }) =>
    apiFetch('/announcements', { method: 'POST', body: JSON.stringify(data) }),
};

// ---------- AI API ----------
export const aiApi = {
  chat: (message: string) =>
    apiFetch<{ response: string }>('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message }),
    }),
};

// ---------- Intelligence API ----------
export const intelligenceApi = {
  metrics: () => apiFetch<LearningMetric>('/intelligence/metrics'),
  recommendations: () => apiFetch<Recommendation[]>('/intelligence/recommendations'),
  notifications: () => apiFetch<UserNotification[]>('/intelligence/notifications'),
  markRead: (id: string) => apiFetch(`/intelligence/notifications/${id}/read`, { method: 'POST' }),
};

// ---------- Users API ----------
export const usersApi = {
  list: (params?: { role?: string; search?: string }) => {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    return apiFetch(`/users${query ? `?${query}` : ''}`);
  },
  get: (id: string) => apiFetch(`/users/${id}`),
};
