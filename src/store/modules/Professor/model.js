import { Model } from '@vuex-orm/core';

export default class Professor extends Model {
  static entity = 'professors';

  static fields() {
    return {
      id: this.attr(''),
      name: this.attr(''),
      surname: this.attr(''),
      title: this.attr('')
    };
  }
}
