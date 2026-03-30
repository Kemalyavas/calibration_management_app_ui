const API_BASE = 'http://localhost:5097/api';

function getToken(): string | null {
  return localStorage.getItem('token');
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    ...options.headers as Record<string, string>,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  if (res.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
    throw new Error('Unauthorized');
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(error.error || error.title || 'Request failed');
  }

  if (res.status === 204) return {} as T;
  return res.json();
}

// Auth
export const authApi = {
  login: (username: string, password: string) =>
    request<{ token: string; username: string; fullName: string; role: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),
  me: () => request<{ id: number; username: string; fullName: string; role: string }>('/auth/me'),
};

// Devices
export const devicesApi = {
  list: (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return request<{ items: any[]; total: number; page: number; pageSize: number; totalPages: number }>(`/devices${query}`);
  },
  get: (id: number) => request<any>(`/devices/${id}`),
  create: (data: any) => request<any>('/devices', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: any) => request<any>(`/devices/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
};

// Calibrations
export const calibrationsApi = {
  list: () => request<any[]>('/calibrations'),
  get: (id: number) => request<any>(`/calibrations/${id}`),
  create: (data: any) => request<any>('/calibrations', { method: 'POST', body: JSON.stringify(data) }),
};

// Approvals
export const approvalsApi = {
  list: () => request<any[]>('/approvals'),
  get: (id: number) => request<any>(`/approvals/${id}`),
  approve: (id: number) => request<any>(`/approvals/${id}/approve`, { method: 'PUT' }),
  reject: (id: number) => request<any>(`/approvals/${id}/reject`, { method: 'PUT' }),
};

// Files
export const filesApi = {
  upload: (calibrationId: number, file: File) => {
    const form = new FormData();
    form.append('file', file);
    return request<any>(`/calibrations/${calibrationId}/files`, { method: 'POST', body: form });
  },
  downloadUrl: (fileId: number) => `${API_BASE}/files/${fileId}`,
};

// Lookup
export const lookupApi = {
  departments: () => request<{ id: number; name: string }[]>('/departments'),
  machines: (departmentId?: number) => {
    const query = departmentId ? `?departmentId=${departmentId}` : '';
    return request<{ id: number; name: string; departmentId: number }[]>(`/machines${query}`);
  },
  calibrationTypes: () => request<{ id: number; name: string }[]>('/calibration-types'),
};

// Procedures
export const proceduresApi = {
  list: () => request<any[]>('/procedures'),
  get: (id: number) => request<any>(`/procedures/${id}`),
};
