import mutations from './mutations';

const state = {
  modalComponent: null,
  modalOpen: false,
  modalProps: null
};

export default {
  namespaced: true,
  state,
  mutations
};
