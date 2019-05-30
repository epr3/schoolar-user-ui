<template>
  <auth-layout>
    <div class="container">
      <div class="card">
        <div class="card-content">
          <template v-if="event">
            <h5 class="subtitle">
              {{ event.subject.name }} - {{ event.eventType.type }}
            </h5>
            <h5 class="subtitle">
              <font-awesome-icon icon="building" />
              {{ event.room }}
            </h5>
            <h5 class="subtitle">
              <font-awesome-icon icon="clock"/>
              {{ event.startTime | formatTime }}
              - {{ event.endTime | formatTime }}
            </h5>
            <h5 class="subtitle">
              <font-awesome-icon icon="user-tie"/>
              {{ `${event.professor.title} ${event.professor.name} ${event.professor.surname}` }}
            </h5>
          </template>
          <base-button
            @click="createSession"
            v-if="profile && profile.professor"
            type="primary"
          >
            Create live QA session
          </base-button>
        </div>
      </div>
      <div class="card">
        <div class="card-content">
          <session-list />
        </div>
      </div>
    </div>
  </auth-layout>
</template>

<script>
import gql from 'graphql-tag';

import { DateTime } from 'luxon';

import EVENT_QUERY from '../graphql/Event/Event.gql';
import SESSIONS_QUERY from '../graphql/Session/Sessions.gql';
import POST_SESSION from '../graphql/Session/PostSession.gql';

import AuthLayout from '../layouts/AuthLayout.vue';

import SessionList from '../containers/SessionList.vue';

import BaseButton from '../components/BaseButton.vue';
import profileQueryMixin from '../mixins/profileQueryMixin';

import errorHandler from '../utils/errorHandler';

export default {
  name: 'event-qa',
  data() {
    return {
      id: this.$route.params.id,
      event: null
    };
  },
  filters: {
    formatTime(value) {
      return DateTime.fromISO(value).toFormat('HH:mm');
    }
  },
  apollo: {
    event: {
      query: gql`
        ${EVENT_QUERY}
      `,
      variables() {
        return {
          id: this.id
        };
      }
    }
  },
  mixins: [profileQueryMixin],
  components: {
    AuthLayout,
    SessionList,
    BaseButton
  },
  methods: {
    async createSession() {
      try {
        await this.$apollo.mutate({
          mutation: POST_SESSION,
          variables: {
            session: {
              eventId: this.$route.params.id
            }
          },
          update: (store, { data: { postSession } }) => {
            const data = store.readQuery({
              query: SESSIONS_QUERY,
              variables: { eventId: this.$route.params.id }
            });
            data.sessions.push(postSession);
            store.writeQuery({
              query: SESSIONS_QUERY,
              data,
              variables: { eventId: this.$route.params.id }
            });
            this.$router.push(`/sessions/${postSession.id}`);
          }
        });
      } catch (e) {
        errorHandler(e);
      }
    }
  }
};
</script>
