import * as constants from './constants';
import { UserState } from '.';
import { ActionTree } from 'vuex';
import { API } from '@/store';

const actions: ActionTree<UserState, {}> = {
  async getProfile({ commit }) {
    commit(constants.START_LOADING);
    try {
      const response = await API.getProfile();
      commit(constants.GET_USER, response.data);
    } catch (e) {
      commit(constants.SET_ERROR, e);
    }
  }
};

export default actions;
