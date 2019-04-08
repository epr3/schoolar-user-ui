import { Module, VuexModule, Mutation } from 'vuex-module-decorators';
import * as constants from './constants';

import { API } from '../../index';

@Module({ namespaced: true })
export default class User extends VuexModule {
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
  public [constants.SET_ERROR](payload: Error) {
    this.loading = false;
    this.error = payload.message;
  }
}
