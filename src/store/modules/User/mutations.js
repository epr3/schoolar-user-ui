import * as constants from './constants';
import User from './model';

export default {
  [constants.START_LOADING](state) {
    state.loading = true;
  },
  [constants.STOP_LOADING](state) {
    state.loading = false;
  },
  [constants.GET_USER](state, payload) {
    state.loading = false;
    state.error = '';
    User.create({ data: payload });
  },
  [constants.SET_ERROR](state, payload) {
    state.loading = false;
    state.error = payload.message;
  }
};
