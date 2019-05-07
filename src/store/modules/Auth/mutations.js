import * as constants from './constants';

export default {
  [constants.AUTH_CHECK_LOGIN]: state => state,
  [constants.START_LOADING](state) {
    state.loading = true;
  },
  [constants.STOP_LOADING](state) {
    state.loading = false;
  },
  [constants.LOGIN](state) {
    state.loading = false;
    state.error = '';
  },
  [constants.RESET_PASSWORD](state) {
    state.loading = false;
    state.error = '';
  },
  [constants.SET_ERROR](state, payload) {
    state.loading = false;
    state.error = payload.message;
  }
};
