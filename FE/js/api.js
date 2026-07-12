// Shared client for the Spring Boot API. The backend runs with context path /library.
const SmartLibraryApi = (() => {
  const BASE_URL = 'http://localhost:8080/library';

  async function request(path, options = {}) {
    const response = await fetch(`${BASE_URL}${path}`, {
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
      ...options
    });
    const body = await response.text();
    if (!response.ok) {
      let message = body || `Lỗi máy chủ (${response.status})`;
      try { message = JSON.parse(body).message || message; } catch (_) { /* text response */ }
      throw new Error(message);
    }
    if (!body) return null;
    const contentType = response.headers.get('content-type') || '';
    return contentType.includes('application/json') ? JSON.parse(body) : body;
  }

  return {
    get: path => request(path),
    post: (path, data) => request(path, { method: 'POST', body: JSON.stringify(data) }),
    patch: (path, data) => request(path, { method: 'PATCH', body: JSON.stringify(data) }),
    put: (path, data) => request(path, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (path, data) => request(path, { method: 'DELETE', body: JSON.stringify(data) }),
    currentUser: () => JSON.parse(localStorage.getItem('smartlibrary-user') || 'null'),
    setCurrentUser: user => localStorage.setItem('smartlibrary-user', JSON.stringify(user)),
    clearCurrentUser: () => localStorage.removeItem('smartlibrary-user')
  };
})();
