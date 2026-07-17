const BASE_URL = import.meta.env.VITE_API_URL;
export const customFetch = async (endpoint: string, options: RequestInit = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  if(response.status === 401) {
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
    throw new Error('인증이 만료되었습니다. 다시 로그인해주세요.');
  }

  if (!response.ok) {
    let errMsg = `HTTP error! status: ${response.status}`;
    try {
      const errData = await response.json();
      if (errData && errData.message) {
        errMsg = errData.message;
      } else if (errData && errData.Message) {
        errMsg = errData.Message;
      }
    } catch {
      try {
        const text = await response.text();
        if (text) errMsg = text;
      } catch {}
    }
    throw new Error(errMsg);
  }

  if (response.status === 204) return null;



  return response.json();


};
