import Vue from 'vue';
import Vuex from 'vuex';
import VuexORM from '@vuex-orm/core';

import Auth from './modules/Auth';

import Modal from './modules/Modal';

import api from '../services/api';

Vue.use(Vuex);

export const API = api();

const database = new VuexORM.Database();

export default new Vuex.Store({
  state: {},
  mutations: {
    AUTH_CHECK_LOGOUT() {},
    LOGOUT() {}
  },
  modules: {
    Auth,
    Modal
  },
  plugins: [VuexORM.install(database)]
});
