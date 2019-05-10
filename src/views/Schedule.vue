<template>
  <auth-layout>
    <div class="container-fluid">
      <div class="card">
        <div class="card-header">
          <div class="columns">
            <div class="column" v-for="day in days" :key="day">{{ day }}</div>
          </div>
        </div>
        <div class="card-body">
          <div class="columns" v-if="eventsComputed">
            <div
              class="column"
              v-for="(item, index) in eventsComputed"
              :key="index"
            >
              <event-card
                v-for="event in item"
                :key="event.id"
                :type="event.type"
                :room="event.room"
                :subject="event.subject"
                :professor="event.professor"
                :group="event.group"
                :start-time="event.startTime"
                :end-time="event.endTime"
                :color="event.color"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </auth-layout>
</template>

<style lang="scss" scoped>
.columns {
  width: 100%;
}
</style>

<script>
import gql from 'graphql-tag';

import PROFILE_QUERY from '../graphql/Auth/Profile.gql';
import PROFESSOR_EVENTS_QUERY from '../graphql/Event/ProfessorEvents.gql';
import STUDENT_EVENTS_QUERY from '../graphql/Event/StudentEvents.gql';

import { DateTime } from 'luxon';

import AuthLayout from '@/layouts/AuthLayout';

import EventCard from '@/components/EventCard.vue';

export default {
  name: 'schedule',
  data: () => ({
    days: [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday'
    ],
    events: [],
    profile: null
  }),
  async mounted() {
    const profileResponse = await this.$apollo.query({ query: PROFILE_QUERY });
    this.profile = profileResponse.data.profile;
    const query = {};
    let queryName = '';
    if (this.profile.professor) {
      query.professorId = this.profile.professor.id;
      queryName = gql`
        ${PROFESSOR_EVENTS_QUERY}
      `;
    }
    if (this.profile.student) {
      query.groupId = this.profile.student.groupId;
      queryName = gql`
        ${STUDENT_EVENTS_QUERY}
      `;
    }
    const eventsResponse = await this.$apollo.query({
      query: queryName,
      variables: {
        ...query,
        startDate: DateTime.local()
          .startOf('week')
          .toFormat('dd-LL-yyyy'),
        endDate: DateTime.local()
          .endOf('week')
          .toFormat('dd-LL-yyyy')
      }
    });
    this.events = [...eventsResponse.data.events];
  },
  components: {
    AuthLayout,
    EventCard
  },
  computed: {
    eventsComputed() {
      if (this.events.length === 0) {
        return {};
      }
      return this.days.reduce((acc, val) => {
        acc[val] = this.events
          .filter(item => DateTime.fromISO(item.date).toFormat('cccc') === val)
          .map(item => ({
            id: item.id,
            room: item.room,
            type: item.eventType.type,
            subject: item.subject.name,
            professor: item.professor
              ? `${item.professor.title} ${item.professor.name} ${
                  item.professor.surname
                }`
              : null,
            group: item.group ? item.group.number : null,
            startTime: DateTime.fromISO(item.startTime).toFormat('HH:mm'),
            endTime: DateTime.fromISO(item.endTime).toFormat('HH:mm'),
            color: item.eventType.color
          }));
        return acc;
      }, {});
    }
  }
};
</script>
