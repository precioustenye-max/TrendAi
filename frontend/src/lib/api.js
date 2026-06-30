const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

function getAuthHeaders() {
  const token = localStorage.getItem('trendai_token');

  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function parseResponse(response) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || data.error || 'Request failed');
  }

  return data;
}

export async function apiRequest(path, options = {}) {
  const headers = {
    ...getAuthHeaders(),
    ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  return parseResponse(response);
}

export async function getAnalysisMarkets() {
  const data = await apiRequest('/api/analysis/markets');
  return data.markets;
}

export async function runChartAnalysis(payload) {
  const data = await apiRequest('/api/analysis', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  return data.analysis;
}

export async function uploadChart(payload) {
  const data = await apiRequest('/api/analyze/upload', {
    method: 'POST',
    body: payload,
  });

  return data;
}

export async function getHistory(params = {}) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, value);
    }
  });

  const suffix = searchParams.toString() ? `?${searchParams.toString()}` : '';
  const data = await apiRequest(`/api/history${suffix}`);
  return data.data;
}

export async function getAnalysisById(id) {
  const data = await apiRequest(`/api/history/${id}`);
  return data.data;
}

export async function deleteAnalysis(id) {
  const data = await apiRequest(`/api/history/${id}`, {
    method: 'DELETE',
  });

  return data.data;
}

export async function saveTradeResult(id, payload) {
  const data = await apiRequest(`/api/history/${id}/result`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  return data.data;
}

export async function getDashboardStats() {
  const data = await apiRequest('/api/dashboard/stats');
  return data.data;
}

export async function getLearningPerformance(params = {}) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, value);
    }
  });

  const suffix = searchParams.toString() ? `?${searchParams.toString()}` : '';
  const data = await apiRequest(`/api/learning/performance${suffix}`);
  return data.data;
}

export async function createTradeAlertFromAnalysis(id) {
  const data = await apiRequest(`/api/alerts/analysis/${id}`, {
    method: 'POST',
  });

  return data.data;
}

export async function getTradeAlerts(params = {}) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, value);
    }
  });

  const suffix = searchParams.toString() ? `?${searchParams.toString()}` : '';
  const data = await apiRequest(`/api/alerts${suffix}`);
  return data.data;
}

export async function checkTradeAlertPrice(id, currentPrice) {
  const data = await apiRequest(`/api/alerts/${id}/check-price`, {
    method: 'POST',
    body: JSON.stringify({ currentPrice: Number(currentPrice) }),
  });

  return data.data;
}

export async function checkTradeAlertLivePrice(id) {
  const data = await apiRequest(`/api/alerts/${id}/check-live-price`, {
    method: 'POST',
  });

  return data.data;
}

export async function checkAllTradeAlertsLive() {
  const data = await apiRequest('/api/alerts/check-all-live', {
    method: 'POST',
  });

  return data.data;
}

export async function cancelTradeAlert(id) {
  const data = await apiRequest(`/api/alerts/${id}`, {
    method: 'DELETE',
  });

  return data.data;
}

export async function getScreenshotReport() {
  const data = await apiRequest('/api/analysis/screenshot-report');
  return data.report;
}

export async function sendContactMessage(payload) {
  const data = await apiRequest('/api/contact', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  return data.contactMessage;
}
