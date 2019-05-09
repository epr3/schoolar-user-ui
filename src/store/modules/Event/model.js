import { Model } from '@vuex-orm/core';
import EventType from '../EventType/model';
import Subject from '../Subject/model';
import Professor from '../Professor/model';
import Group from '../Group/model';

export default class Event extends Model {
  static entity = 'events';

  static fields() {
    return {
      id: this.attr(''),
      room: this.attr(''),
      interval: this.attr(0),
      frequency: this.attr(''),
      startDate: this.attr(''),
      endDate: this.attr(''),
      startTime: this.attr(''),
      endTime: this.attr(''),
      isFullDay: this.attr(false),
      isNotifiable: this.attr(false),
      eventTypeId: this.attr(''),
      groupId: this.attr(''),
      professorId: this.attr(''),
      subjectId: this.attr(''),
      event_type: this.belongsTo(EventType, 'eventTypeId'),
      group: this.belongsTo(Group, 'groupId'),
      subject: this.belongsTo(Subject, 'subjectId'),
      professor: this.belongsTo(Professor, 'professorId')
    };
  }
}
