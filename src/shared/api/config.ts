const BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'https://localhost:7131').replace(/\/$/, '');

export default BASE_URL;
