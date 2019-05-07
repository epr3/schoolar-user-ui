import mutations from './mutations';
import actions from './actions';

const state = {
  loading: false,
  error: ''
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
