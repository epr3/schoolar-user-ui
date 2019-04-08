import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators';
import * as constants from './constants';

import { API } from '../../index';

@Module({ namespaced: true })
export default class Auth extends VuexModule {
  public loading = false;
  public error = '';

  @Mutation
  public [constants.START_LOADING]() {
    this.loading = true;
  }
  @Mutation
  public [constants.STOP_LOADING]() {
    this.loading = false;
  }
  @Mutation
  public [constants.LOGIN]() {
    this.loading = false;
    this.error = '';
  }
  @Mutation
  public [constants.SET_ERROR](payload: Error) {
    this.loading = false;
    this.error = payload.message;
  }

  @Action
  public async login(payload: { email: string; password: string }) {
    this.context.commit(constants.START_LOADING);
    try {
      const response = await API.postLogin(payload);
      localStorage.setItem(
        process.env.VUE_APP_ACCESS_TOKEN,
        response.data.accessToken
      );
      localStorage.setItem(
        process.env.VUE_APP_REFRESH_TOKEN,
        response.data.refreshToken
      );
      this.context.commit(constants.LOGIN);
    } catch (e) {
      this.context.commit(constants.SET_ERROR, e);
    }
  }
}
