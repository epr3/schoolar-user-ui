import { Model } from '@vuex-orm/core';

export default class User extends Model {
  public static entity = 'user';

  public static fields() {
    return {
      id: this.attr(''),
      email: this.attr(''),
      name: this.attr(''),
      surname: this.attr(''),
      title: this.attr(''),
      groupId: this.attr(''),
      telephone: this.attr('')
    };
  }
}
