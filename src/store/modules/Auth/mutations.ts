import * as constants from './constants';
import { MutationTree } from 'vuex';
import { AuthState } from '.';

const mutations: MutationTree<AuthState> = {
  [constants.START_LOADING](state: AuthState) {
    state.loading = true;
  },
  [constants.STOP_LOADING](state: AuthState) {
    state.loading = false;
  },
  [constants.LOGIN](state: AuthState) {
    state.loading = false;
    state.error = '';
  },
  [constants.SET_ERROR](state: AuthState, payload: Error) {
    state.loading = false;
    state.error = payload.message;
  }
};

export default mutations;
