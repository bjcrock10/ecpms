import axios, { AxiosInstance } from "axios";

// Get the CSRF token from the meta tag
// const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

// Create the Axios instance
// baseURL:'https://ecpmsapi.dti7.site/',  
// baseURL:'https://cfidp.cebudigital.com/bkApi',
//baseURL:'https://dti.cebudigital.com/ecpms',
// baseURL:'https://cfidp.pythonanywhere.com/',
// baseURL:'https://cfidp.cebudigital.com/app', / http://10.20.13.112:5173 BT3&s>t;n@pz`+jZbDw$g[     E@dmin2032

const apiClient: AxiosInstance = axios.create({
    auth: {
        username: 'admin',
        password: 'qwerty', //'E@dmin2032'
    },
    //baseURL: 'http://localhost:8000/', // Update with your base URL
    //baseURL:'https://ecpmsv3api.dti7.site/',
    // baseURL: 'http://52.90.160.169:8000/',
    baseURL: 'https://cpmsapi.ecpms-caraga.org/',
    timeout: 100000,
    withCredentials: true, // Include cookies in requests
});

// Set the CSRF token header dynamically
// const csrfToken = getCSRFToken();
// if (csrfToken) {
//     apiClient.defaults.headers['X-CSRFToken'] = csrfToken;
//     //alert(csrfToken)
// }
const csrfTokenElement = document.querySelector('meta[name="csrf-token"]');
const csrfToken = csrfTokenElement ? csrfTokenElement.getAttribute('content') : '';

if (!csrfToken) {
  console.error('CSRF token not found');
} else {
  // Set the CSRF token in the Axios default headers
  axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;
  axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
  axios.defaults.headers.common['Content-Type'] = 'application/json';
}

// Export the configured Axios instance
export default apiClient;
