import Vue from 'vue';
import Vuex from 'vuex';
import VuexORM from '@vuex-orm/core';

import Auth from './modules/Auth';

import api from '../services/api';

Vue.use(Vuex);

export const API = api();

const database = new VuexORM.Database();

export default new Vuex.Store({
  state: {},
  mutations: {
    AUTH_CHECK_LOGOUT() {
    },
    LOGOUT() {
    }
  },
  actions: {},
  modules: {
    Auth
  },
  plugins: [VuexORM.install(database)]
});
