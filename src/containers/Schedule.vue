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
        <div class="content" :style="{ padding: '16px'}">
          <div class="media">
            <div class="media-left">
              <font-awesome-icon icon="chevron-left" size="2x" @click="previousWeek"/>
            </div>
            <div class="media-content has-text-centered">
              <strong
                class="is-size-4"
              >{{ weekHandles.startOfWeek | humanDate }} - {{ weekHandles.endOfWeek | humanDate }}</strong>
            </div>
            <div class="media-right">
              <font-awesome-icon icon="chevron-right" size="2x" @click="nextWeek"/>
            </div>
          </div>
        </div>
      </div>
      <mq-layout :mq="['sm', 'md']">
        <div class="card">
          <div class="card-content">
            <progress v-if="loading" class="progress is-small is-primary" max="100"/>
            <div class="columns is-multiline" v-if="eventsComputed.length">
              <div v-for="(item, index) in eventsComputed" :key="index" class="column is-12">
                <div class="card">
                  <div class="card-header">
                    <h5 class="card-header-title">{{ days[index] | day }}</h5>
                    <span class="tag">{{ item.length }}</span>
                  </div>
                  <div class="card-content">
                    <template v-if="item.length">
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
                            @click="$router.push(`/schedule/${event.eventId}/sessions`)"
                          >Sessions</div>
                          <div
                            v-if="profile && profile.student"
                            @click="$router.push(`/schedule/${event.eventId}/results`)"
                            class="card-footer-item"
                          >Results</div>
                        </template>
                      </event-card>
                    </template>
                    <div class="notification" v-else>No events for current day.</div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="columns">
              <div class="column">
                <div class="notification">No events to show for current query.</div>
              </div>
            </div>
          </div>
        </div>
      </mq-layout>
      <mq-layout mq="lg+">
        <div class="card" :style="{ padding: '1rem' }">
          <div class="card-header">
            <div class="columns">
              <div class="column" v-for="day in daysComputed" :key="day">
                <h5 class="is-size-4 has-text-centered">{{ day }}</h5>
              </div>
            </div>
          </div>
          <div class="card-content">
            <progress v-if="loading" class="progress is-small is-primary" max="100"/>
            <div class="columns" v-if="eventsComputed.length" :style="{ marginTop: '10px' }">
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
                      @click="$router.push(`/schedule/${event.eventId}/sessions`)"
                    >Sessions</div>
                    <div
                      v-if="profile && profile.student"
                      @click="$router.push(`/schedule/${event.eventId}/results`)"
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
      </mq-layout>
    </div>
  </auth-layout>
</template>

<style lang="scss" scoped>
.columns {
  width: 100%;
}
.card-content {
  position: relative;
}
.progress {
  position: absolute;
  left: 0;
  top: 0;
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
import errorHandler from '../utils/errorHandler';

export default {
  name: 'schedule',
  data() {
    const dateArray = [];
    for (let i = 0; i < 7; i++) {
      dateArray.push(
        DateTime.local()
          .startOf('week')
          .plus({ days: i })
      );
    }
    return {
      days: dateArray,
      weekHandles: {
        startOfWeek: DateTime.local().startOf('week'),
        endOfWeek: DateTime.local().endOf('week')
      },
      loading: false,
      events: [],
      profile: null,
      groupId: null,
      userId: null,
      professors: [],
      groups: [],
      queryName: null
    };
  },
  filters: {
    humanDate(value) {
      return DateTime.fromISO(value).toFormat('dd MMM yyyy');
    },
    day(value) {
      return value.toFormat('cccc');
    }
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
      await this.getEvents();
    } catch (e) {
      errorHandler(e);
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
    daysComputed() {
      return this.days.map(item => item.toFormat('cccc'));
    },
    eventsComputed() {
      if (this.events.length === 0) {
        return [];
      }
      return this.days.map(day => {
        return this.events
          .filter(
            item =>
              DateTime.fromISO(item.date).toFormat('cccc') ===
              day.toFormat('cccc')
          )
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
            color: item.eventType.color,
            eventId: item.eventId
          }));
      });
    }
  },
  methods: {
    nextWeek() {
      this.weekHandles.startOfWeek = this.weekHandles.startOfWeek.plus({
        days: 7
      });
      this.weekHandles.endOfWeek = this.weekHandles.endOfWeek.plus({ days: 7 });
    },
    previousWeek() {
      this.weekHandles.startOfWeek = this.weekHandles.startOfWeek.minus({
        days: 7
      });
      this.weekHandles.endOfWeek = this.weekHandles.endOfWeek.minus({
        days: 7
      });
    },
    async getEvents() {
      this.loading = true;
      const eventsResponse = await this.$apollo.query({
        query: this.queryName,
        variables: {
          groupId: this.groupId,
          userId: this.userId,
          startDate: this.weekHandles.startOfWeek.toFormat('dd-LL-yyyy'),
          endDate: this.weekHandles.endOfWeek.toFormat('dd-LL-yyyy')
        }
      });
      this.events = [...eventsResponse.data.events];
      this.loading = false;
    }
  },
  watch: {
    weekHandles: {
      async handler() {
        await this.getEvents();
      },
      deep: true
    },
    async groupId() {
      await this.getEvents();
    },
    async userId() {
      await this.getEvents();
    }
  }
};
</script>
