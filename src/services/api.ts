import axios from 'axios';

const create = () => {
  const api = axios.create({
    baseURL: process.env.VUE_APP_API_URL,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  });

  const postLogin = (loginObj: object) => api.post('/login', loginObj);
  const postLogout = () => api.post('/logout');

  api.interceptors.request.use(
    config => {
      if (!['/login', '/register'].some(item => item === config.url)) {
        const accessToken = localStorage.getItem(
          process.env.VUE_APP_ACCESS_TOKEN
        );
        config.headers.Authorization = accessToken;
      }
      return config;
    },
    error => {
      // Do something with request error
      return Promise.reject(error);
    }
  );

  // Add a response interceptor
  api.interceptors.response.use(
    response => {
      // Do something with response data
      return response;
    },
    error => {
      // Do something with response error
      return Promise.reject(error);
    }
  );

  return {
    postLogin,
    postLogout
  };
};

export default create;
