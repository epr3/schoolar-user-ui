import * as constants from './constants';
import { UserState } from '.';
import User from './model';
import { MutationTree } from 'vuex';

const mutations: MutationTree<UserState> = {
  [constants.START_LOADING](state: UserState) {
    state.loading = true;
  },
  [constants.STOP_LOADING](state: UserState) {
    state.loading = false;
  },
  [constants.SET_ERROR](state: UserState, payload: Error) {
    state.loading = false;
    state.error = payload.message;
  },
  [constants.GET_USER](state: UserState, payload: object) {
    state.loading = false;
    User.insert({ data: payload });
  }
};

export default mutations;
