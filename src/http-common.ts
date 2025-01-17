import axios, { AxiosInstance } from "axios";

const apiClient: AxiosInstance = axios.create({
    auth:{
        username: 'admin',
        password: 'E@dmin2032'
    },
    // baseURL:'https://cfidp.cebudigital.com/app', /
     baseURL:'http://localhost:8000/',
    // baseURL:'https://ecpmsapi.dti7.site/',  
    // baseURL:'https://cfidp.cebudigital.com/bkApi',
    //baseURL:'https://dti.cebudigital.com/ecpms',
    // baseURL:'https://cfidp.pythonanywhere.com/',
    timeout: 100000,
});

export default apiClient;
