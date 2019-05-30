import Vue from 'vue';
import Vuex from 'vuex';

import Modal from './modules/Modal';
import Error from './modules/Error';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  modules: {
    Modal,
    Error
  }
});
