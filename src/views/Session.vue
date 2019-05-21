<template>
  <auth-layout>
    <div class="container">
      <base-button
        v-if="profile && profile.student"
        type="primary"
        @click="openQuestionModal"
      >
        Post Question
      </base-button>
      <div class="card" v-else-if="session">
        <div class="card-header">
          <div class="card-header-title">
            <h2 class="title">
              Code: <strong>{{ session.code }}</strong>
            </h2>
          </div>
        </div>
      </div>
      <div>
        <question-list />
      </div>
    </div>
  </auth-layout>
</template>

<script>
import { mapMutations } from 'vuex';
import gql from 'graphql-tag';
import SESSION_QUERY from '../graphql/Session/Session.gql';

import AuthLayout from '../layouts/AuthLayout.vue';

import QuestionList from '../containers/QuestionList.vue';

import BaseButton from '../components/BaseButton.vue';

import profileQueryMixin from '../mixins/profileQueryMixin';

export default {
  name: 'session',
  data() {
    return {
      session: null,
      routeParam: this.$route.params.id
    };
  },
  mixins: [profileQueryMixin],
  apollo: {
    session: {
      query: gql`
        ${SESSION_QUERY}
      `,
      variables() {
        return {
          id: this.routeParam
        };
      }
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
    }
  }
};
</script>
