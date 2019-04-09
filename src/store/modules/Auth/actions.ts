import * as constants from './constants';
import { API } from '@/store';
import { ActionTree } from 'vuex';
import { AuthState } from '.';

const actions: ActionTree<AuthState, {}> = {
  async login({ commit }, payload: { email: string; password: string }) {
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
    } catch (e) {
      commit(constants.SET_ERROR, e);
    }
  }
};

export default actions;
