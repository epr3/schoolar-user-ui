import * as constants from './constants';
import { API } from '@/store';

export default {
  async getUser({ commit }) {
    commit(constants.START_LOADING);
    try {
      const response = await API.getProfile();
      commit(constants.GET_USER, response.data);
    } catch (e) {
      commit(constants.SET_ERROR, e);
    }
  }
};
