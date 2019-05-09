import { Model } from '@vuex-orm/core';

export default class Subject extends Model {
  static entity = 'subjects';

  static fields() {
    return {
      id: this.attr(''),
      name: this.attr(''),
      credits: this.attr(0)
    };
  }
}
