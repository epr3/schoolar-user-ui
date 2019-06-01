<template>
  <auth-layout>
    <div class="container-fluid" :style="{ padding: '1rem' }">
      <div class="card">
        <div class="card-content">
          <div class="field is-grouped">
            <base-select label="Group" :v="$v.groupId" v-model="groupId" :options="groupSelect"/>
            <base-select
              label="Professors"
              :v="$v.userId"
              v-model="userId"
              :options="professorSelect"
            />
          </div>
        </div>
      </div>
      <div class="card" :style="{ padding: '1rem' }">
        <div class="card-header">
          <div class="columns">
            <div class="column" v-for="day in days" :key="day">
              <h5 class="is-size-4 has-text-centered">{{ day }}</h5>
            </div>
          </div>
        </div>
        <div class="card-content">
          <div class="columns" v-if="eventsComputed" :style="{ marginTop: '10px' }">
            <div class="column" v-for="(item, index) in eventsComputed" :key="index">
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
              >
                <template #footer>
                  <div
                    class="card-footer-item"
                    @click="$router.push(`/schedule/${event.id}/sessions`)"
                  >Sessions</div>
                  <div
                    v-if="profile && profile.student"
                    @click="$router.push(`/schedule/${event.id}/results`)"
                    class="card-footer-item"
                  >Results</div>
                </template>
              </event-card>
            </div>
          </div>
          <div v-else class="columns">
            <div class="column">
              <div class="notification">No events to show for current query.</div>
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
import GROUPS_QUERY from '../graphql/Group/Groups.gql';
import PROFESSORS_QUERY from '../graphql/Professor/Professors.gql';

import { validationMixin } from 'vuelidate';
import { alphaNum } from 'vuelidate/lib/validators';

import { DateTime } from 'luxon';

import AuthLayout from '@/layouts/AuthLayout';

import BaseSelect from '@/components/BaseSelect.vue';
import EventCard from '@/components/EventCard.vue';

export default {
  name: 'schedule',
  data() {
    return {
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
      profile: null,
      groupId: null,
      userId: null,
      professors: [],
      groups: [],
      queryName: null
    };
  },
  mixins: [validationMixin],
  validations: {
    userId: { alphaNum },
    groupId: { alphaNum }
  },
  apollo: {
    groups: GROUPS_QUERY,
    professors: PROFESSORS_QUERY
  },
  async mounted() {
    try {
      const profileResponse = await this.$apollo.query({
        query: PROFILE_QUERY
      });
      this.profile = profileResponse.data.profile;
      if (this.profile.professor) {
        this.userId = this.profile.professor.userId;
        this.queryName = gql`
          ${PROFESSOR_EVENTS_QUERY}
        `;
      }
      if (this.profile.student) {
        this.groupId = this.profile.student.groupId;
        this.queryName = gql`
          ${STUDENT_EVENTS_QUERY}
        `;
      }
      const eventsResponse = await this.$apollo.query({
        query: this.queryName,
        variables: {
          groupId: this.groupId,
          userId: this.userId,
          startDate: DateTime.local()
            .startOf('week')
            .toFormat('dd-LL-yyyy'),
          endDate: DateTime.local()
            .endOf('week')
            .toFormat('dd-LL-yyyy')
        }
      });
      this.events = [...eventsResponse.data.events];
    } catch (e) {
      throw new Error(e);
    }
  },
  components: {
    AuthLayout,
    EventCard,
    BaseSelect
  },
  computed: {
    professorSelect() {
      return this.professors.map(item => ({
        id: item.id,
        value: item.userId,
        label: `${item.title} ${item.name} ${item.surname}`
      }));
    },
    groupSelect() {
      return this.groups.map(item => ({
        id: item.id,
        value: item.id,
        label: item.number
      }));
    },
    eventsComputed() {
      if (this.events.length === 0) {
        return {};
      }
      return this.days.reduce((acc, val) => {
        acc[val] = this.events
          .filter(item => DateTime.fromISO(item.date).toFormat('cccc') === val)
          .filter(item => (this.userId ? item.userId === this.userId : true))
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
  },
  watch: {
    async groupId() {
      const eventsResponse = await this.$apollo.query({
        query: this.queryName,
        variables: {
          groupId: this.groupId,
          userId: this.userId,
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
    async userId() {
      const eventsResponse = await this.$apollo.query({
        query: this.queryName,
        variables: {
          groupId: this.groupId,
          userId: this.userId,
          startDate: DateTime.local()
            .startOf('week')
            .toFormat('dd-LL-yyyy'),
          endDate: DateTime.local()
            .endOf('week')
            .toFormat('dd-LL-yyyy')
        }
      });
      this.events = [...eventsResponse.data.events];
    }
  }
};
</script>
