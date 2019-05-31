<template>
  <div class="columns">
    <div class="column">
      <ul v-if="openSessions.length">
        <li v-for="item in openSessions" :key="item.id">
          <session-item
            :subject="item.event.subject.name"
            :type="item.event.eventType.type"
            :date="item.createdAt"
            :color="item.event.eventType.color"
            @click="$router.push(`/sessions/${item.id}`)"
          />
        </li>
      </ul>
      <div v-else class="notification">
        No sessions were created for this event.
      </div>
    </div>
    <div class="column">
      <ul v-if="closedSessions.length">
        <li v-for="item in closedSessions" :key="item.id">
          <session-item
            :subject="item.event.subject.name"
            :type="item.event.eventType.type"
            :color="item.event.eventType.color"
            :date="item.createdAt"
            @click="$router.push(`/sessions/${item.id}`)"
          />
        </li>
      </ul>
      <div v-else class="notification">
        No sessions were finished for this event yet.
      </div>
    </div>
  </div>
</template>

<script>
import gql from 'graphql-tag';

import SESSION_QUERY from '../graphql/Session/Sessions.gql';

import SessionItem from '../components/SessionItem.vue';

export default {
  data() {
    return {
      sessions: [],
      routeParam: this.$route.params.id
    };
  },
  apollo: {
    sessions: {
      query: gql`
        ${SESSION_QUERY}
      `,
      variables() {
        return {
          eventId: this.routeParam
        };
      }
    }
  },
  components: {
    SessionItem
  },
  computed: {
    openSessions() {
      return this.sessions.filter(item => item.status === 'open');
    },
    closedSessions() {
      return this.sessions.filter(item => item.status === 'closed');
    }
  }
};
</script>
