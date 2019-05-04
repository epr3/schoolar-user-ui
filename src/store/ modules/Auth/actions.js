import * as constants from './constants';
import { API } from '@/store';
import router from '../../../router';

export default {
  authCheck({ commit }) {
    if (
      localStorage.getItem(process.env.VUE_APP_ACCESS_TOKEN) &&
      localStorage.getItem(process.env.VUE_APP_REFRESH_TOKEN)
    ) {
      commit(constants.AUTH_CHECK_LOGIN);
    } else {
      commit(constants.AUTH_CHECK_LOGOUT, null, { root: true });
    }
  },
  async login({ commit }, payload) {
    commit(constants.START_LOADING);
    try {
      const response = await API.postLogin(payload);
      localStorage.setItem(
        process.env.VUE_APP_ACCESS_TOKEN,
        response.data.accessToken
      );
      localStorage.setItem(
        process.env.VUE_APP_REFRESH_TOKEN,
        response.data.refreshToken
      );
      commit(constants.LOGIN);
      router.replace('/');
    } catch (e) {
      commit(constants.SET_ERROR, e);
    }
  },
  async logout({ commit }) {
    commit(constants.START_LOADING);
    try {
      await API.deleteLogout();
      localStorage.removeItem(process.env.VUE_APP_ACCESS_TOKEN);
      localStorage.removeItem(process.env.VUE_APP_REFRESH_TOKEN);
      commit(constants.LOGOUT, null, { root: true });
      router.replace('/login');
    } catch (e) {
      commit(constants.SET_ERROR, e);
    }
  }
};
