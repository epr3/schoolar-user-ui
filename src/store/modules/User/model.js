import { Model } from '@vuex-orm/core';

export default class User extends Model {
  static entity = 'users';

  static fields() {
    return {
      id: this.attr(''),
      name: this.attr(''),
      email: this.attr(''),
      surname: this.attr(''),
      title: this.attr(''),
      role: this.attr(''),
      groupId: this.attr(''),
      telephone: this.attr('')
    };
  }
}
