const BASE_URL = import.meta.env.VITE_API_URL;
export const customFetch = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  if (response.status === 204) return null;

    if(response.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }

  return response.json();


};
