<template>
  <div>
    <ul v-if="sessions.length">
      <li v-for="item in sessions" :key="item.id">
        <session-item
          :code="item.code"
          :subject="item.event.subject.name"
          :type="item.event.eventType.type"
          @click="$router.push(`/sessions/${item.id}`)"
        />
      </li>
    </ul>
    <div v-else class="notification">
      No sessions were created for this event.
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
  }
};
</script>
