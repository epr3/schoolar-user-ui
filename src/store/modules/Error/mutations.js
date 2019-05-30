import * as constants from './constants';

export default {
  [constants.SET_ERROR](state, payload) {
    state.errors = state.errors.concat(payload);
  },
  [constants.CLEAR_ERROR](state) {
    state.errors = [];
  }
};
