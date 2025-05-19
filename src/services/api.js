const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export const checkBackendStatus = async () => {
    try {
        const response = await fetch(`${API_URL}/`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error checking backend status:', error);
        throw error;
    }
}; 