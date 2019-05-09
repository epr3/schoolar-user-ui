import { Model } from '@vuex-orm/core';

export default class EventType extends Model {
  static entity = 'event_types';

  static fields() {
    return {
      id: this.attr(''),
      type: this.attr(''),
      color: this.attr('')
    };
  }
}
