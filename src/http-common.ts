import axios, { AxiosInstance } from "axios";

// Create the Axios instance
const apiClient: AxiosInstance = axios.create({
  auth: {
    username: 'admin',
    password: 'E@dmin2032',
  },
  //baseURL: 'https://cpmsapi.ecpms-caraga.org/',
  baseURL:'https://ecpmsv3api.dti7.site/',
  timeout: 100000,
  withCredentials: true,
});

// Get CSRF token from meta tag
const csrfTokenElement = document.querySelector('meta[name="csrf-token"]');
const csrfToken = csrfTokenElement ? csrfTokenElement.getAttribute('content') : '';

if (!csrfToken) {
  console.error('CSRF token not found');
} else {
  // ✅ Set the headers on *apiClient*, not global axios
  apiClient.defaults.headers.common['X-CSRFToken'] = csrfToken;
  apiClient.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
  apiClient.defaults.headers.common['Content-Type'] = 'application/json';
}

// Export the configured Axios instance
export default apiClient;
