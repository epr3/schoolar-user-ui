<template>
  <auth-layout>
    <div class="container">
      <template v-if="session && session.status === 'open'">
        <div class="card" v-if="profile && profile.student">
          <div class="card-content">
            <base-button type="primary" @click="openQuestionModal">Post Question</base-button>
          </div>
        </div>
        <div class="card" v-if="profile && profile.professor">
          <div class="card-content">
            <base-button type="primary" @click="closeSession" :disabled="loading">Close Session</base-button>
          </div>
        </div>
      </template>
      <div class="card">
        <div class="card-header">
          <div class="card-header-title" v-if="session">
            <h2 class="title">
              Session date:
              <strong>{{ session.createdAt | toHumanDate }}</strong>
            </h2>
          </div>
        </div>
        <div v-if="session" class="card-content">
          <h3 class="subtitle">Session status: {{ session.status }}</h3>
          <question-list :status="session.status"/>
        </div>
      </div>
    </div>
  </auth-layout>
</template>

<script>
import { DateTime } from 'luxon';

import { mapMutations } from 'vuex';

import gql from 'graphql-tag';

import SESSION_QUERY from '../graphql/Session/Session.gql';
import CLOSE_SESSION from '../graphql/Session/CloseSession.gql';
import CLOSE_SESSION_SUBSCRIPTION from '../graphql/Session/CloseSessionSubscription.gql';

import AuthLayout from '../layouts/AuthLayout.vue';

import QuestionList from '../containers/QuestionList.vue';

import BaseButton from '../components/BaseButton.vue';

import loadingMixin from '../mixins/loadingMixin';
import profileQueryMixin from '../mixins/profileQueryMixin';
import errorHandler from '../utils/errorHandler';

export default {
  name: 'session',
  data() {
    return {
      session: null,
      routeParam: this.$route.params.id
    };
  },
  mixins: [profileQueryMixin, loadingMixin],
  filters: {
    toHumanDate(value) {
      return DateTime.fromISO(value).toFormat('dd-MM-yyyy HH:mm');
    }
  },
  apollo: {
    session: {
      query: gql`
        ${SESSION_QUERY}
      `,
      variables() {
        return {
          id: this.routeParam
        };
      },
      subscribeToMore: [
        {
          document: CLOSE_SESSION_SUBSCRIPTION,
          updateQuery: (
            previousData,
            {
              subscriptionData: {
                data: { closeSession }
              }
            }
          ) => ({ ...previousData, session: { ...closeSession } })
        }
      ]
    }
  },
  components: {
    AuthLayout,
    QuestionList,
    BaseButton
  },
  methods: {
    ...mapMutations({
      openModal: 'Modal/OPEN_MODAL',
      modalClose: 'Modal/CLOSE_MODAL'
    }),
    openQuestionModal(props) {
      this.openModal({
        component: () => import('@/containers/QuestionModal.vue'),
        props
      });
    },
    async closeSession() {
      this.loading = true;
      try {
        await this.$apollo.mutate({
          mutation: CLOSE_SESSION,
          variables: { id: this.$route.params.id }
        });
      } catch (e) {
        errorHandler(e);
      }
      this.loading = false;
    }
  }
};
</script>
