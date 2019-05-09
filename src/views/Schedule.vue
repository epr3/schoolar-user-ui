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
          <!-- <div class="columns" v-if="events">
            <div class="column" v-for="(item, index) in events" :key="index">
              <event-card
                v-for="event in item"
                :key="event.id"
                :type="event.type"
                :subject="event.subject"
                :professor="event.professor"
                :start-time="event.startTime"
                :end-time="event.endTime"
                :color="event.color"
              />
            </div>
          </div> -->
        </div>
      </div>
    </div>
  </auth-layout>
</template>

<script>
import { mapActions, mapMutations, mapGetters } from 'vuex';

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
    ]
  }),
  components: {
    AuthLayout,
    EventCard
  },
  computed: {
    ...mapGetters({
      userQuery: 'entities/users/query'
    }),
    user() {
      return this.userQuery().all().first();
    }
  }
};
</script>
