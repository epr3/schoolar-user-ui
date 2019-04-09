import mutations from './mutations';
import actions from './actions';

export interface AuthState {
  loading: boolean;
  error: string;
}

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
