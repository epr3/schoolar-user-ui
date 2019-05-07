import Vue from 'vue';
import Vuex from 'vuex';
import VuexORM from '@vuex-orm/core';

import Auth from './modules/Auth';
import User from './modules/User';

import Modal from './modules/Modal';

import UserModel from './modules/User/model';

import api from '../services/api';

Vue.use(Vuex);

export const API = api();

const database = new VuexORM.Database();
database.register(UserModel);

export default new Vuex.Store({
  state: {},
  mutations: {
    AUTH_CHECK_LOGOUT() {
      UserModel.deleteAll();
    },
    LOGOUT() {
      UserModel.deleteAll();
    }
  },
  modules: {
    Auth,
    Modal,
    User
  },
  plugins: [VuexORM.install(database)]
});
