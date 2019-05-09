import { Model } from '@vuex-orm/core';

export default class Group extends Model {
  static entity = 'groups';

  static fields() {
    return {
      id: this.attr(''),
      number: this.attr(''),
      year: this.attr('')
    };
  }
}
