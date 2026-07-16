// JWT 디코더 헬퍼
export const parseJwt = (token: string) => {
    if(!token || typeof token !== 'string') {
        return null;
    }

    try {
        const parts = token.split('.');
        if (parts.length < 3) {
            return null;
        }
        const base64Url = parts[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
        window.atob(base64)
            .split('')
            .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error('JWT 파싱 오류:', e);
        return null;
    }
};

// 토큰 만료 여부
export const isTokenExpired = (token: string): boolean => {
    const payload = parseJwt(token);
    if (!payload || !payload.exp) {
        return true; // 토큰이 없거나 만료 정보가 없으면 만료로 간주
    }

    const currentTime = Math.floor(Date.now() / 1000); // 현재 시간을 초 단위로 변환
    return payload.exp < currentTime; // 만료 시간이 현재 시간보다 이전이면 만료
}