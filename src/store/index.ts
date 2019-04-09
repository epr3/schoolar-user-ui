import Vue from 'vue';
import Vuex from 'vuex';
import VuexORM from '@vuex-orm/core';
import UserModel from './modules/User/model';

import Auth from './modules/Auth';
import User from './modules/User';

import api from '../services/api';

Vue.use(Vuex);

export const API = api();

const database = new VuexORM.Database();
database.register(UserModel);

export default new Vuex.Store<{}>({
  state: {},
  mutations: {
    LOGOUT() {
      UserModel.deleteAll();
    }
  },
  actions: {},
  modules: {
    Auth,
    User
  },
  plugins: [VuexORM.install(database)]
});
