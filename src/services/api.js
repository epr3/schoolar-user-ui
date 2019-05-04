import axios from 'axios';
import router from '../router';
import store from '../store';

const create = () => {
  const api = axios.create({
    baseURL: process.env.VUE_APP_API_URL,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  });

  const postLogin = loginObj => api.post('/login', loginObj);
  const getProfile = () => api.get('/profile');
  const deleteLogout = () => api.delete('/logout');

  const getProfessors = () => api.get('/professors');

  const getFaculties = () => api.get('/faculties');
  const getFacultyById = id => api.get(`/faculties/${id}`);

  const getGroupById = id => api.get(`/groups/${id}`);
  const getGroupsByFacultyId = id => api.get(`/faculties/${id}/groups`);
  const getSubjectsByFacultyId = id => api.get(`/faculties/${id}/subjects`);
  const getEventsByGroupId = id => api.get(`/groups/${id}/events`);

  const getEventTypes = () => api.get('/event_types');

  api.interceptors.request.use(
    config => {
      if (config.url !== '/login') {
        const accessToken = localStorage.getItem(
          process.env.VUE_APP_ACCESS_TOKEN
        );
        config.headers.Authorization = `JWT ${accessToken}`;
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
    async error => {
      const status = error.response ? error.response.status : null;
      if (
        status === 401 &&
        error.config &&
        !error.config.__isRetryRequest &&
        !error.config.url.includes('/refresh')
      ) {
        const refreshToken = localStorage.getItem(
          process.env.VUE_APP_REFRESH_TOKEN
        );
        if (!refreshToken) {
          return Promise.reject(error);
        }
        try {
          const response = await api.post('/refresh', { refreshToken });
          localStorage.setItem(
            process.env.VUE_APP_ACCESS_TOKEN,
            response.data.accessToken
          );
          localStorage.setItem(
            process.env.VUE_APP_REFRESH_TOKEN,
            response.data.refreshToken
          );
          error.config.__isRetryRequest = true;
          return api(error.config);
        } catch (e) {
          return Promise.reject(e);
        }
      }

      if (error.config.url.includes('/refresh')) {
        localStorage.removeItem(process.env.VUE_APP_ACCESS_TOKEN);
        localStorage.removeItem(process.env.VUE_APP_REFRESH_TOKEN);
        store.commit('LOGOUT');
        router.replace('/login');
      }
      return Promise.reject(error);
    }
  );

  return {
    postLogin,
    getProfile,
    deleteLogout,
    getFacultyById,
    getFaculties,
    getGroupsByFacultyId,
    getSubjectsByFacultyId,
    getEventsByGroupId,
    getGroupById,
    getProfessors,
    getEventTypes
  };
};

export default create;
