<template>
  <auth-layout>
    <div class="container">
      <base-button
        @click="createSession"
        v-if="profile && profile.professor"
        type="primary"
      >
        Create live QA session
      </base-button>
      <session-list />
    </div>
  </auth-layout>
</template>

<script>
import shortid from 'shortid';

import SESSIONS_QUERY from '../graphql/Session/Sessions.gql';
import POST_SESSION from '../graphql/Session/PostSession.gql';

import AuthLayout from '../layouts/AuthLayout.vue';

import SessionList from '../containers/SessionList.vue';

import BaseButton from '../components/BaseButton.vue';
import profileQueryMixin from '../mixins/profileQueryMixin';

export default {
  name: 'event-qa',
  mixins: [profileQueryMixin],
  components: {
    AuthLayout,
    SessionList,
    BaseButton
  },
  methods: {
    createSession() {
      try {
        this.$apollo.mutate({
          mutation: POST_SESSION,
          variables: {
            session: {
              code: shortid.generate(),
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
        console.error(e);
      }
    }
  }
};
</script>
