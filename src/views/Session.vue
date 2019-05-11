<template>
  <auth-layout>
    <div class="container">
      <base-button
        v-if="profile && profile.student"
        type="primary"
        @click="openQuestionModal"
      >Post Question</base-button>
      <p>{{ questions }}</p>
    </div>
  </auth-layout>
</template>

<script>
import { mapMutations } from 'vuex';
import gql from 'graphql-tag';
import SESSION_QUERY from '../graphql/Session/Session.gql';
import PROFILE_QUERY from '../graphql/Auth/Profile.gql';
import POST_QUESTION_SUBSCRIPTION from '../graphql/Question/PostQuestionSubscription.gql';

import AuthLayout from '../layouts/AuthLayout.vue';

import BaseButton from '../components/BaseButton.vue';

export default {
  name: 'session',
  data() {
    return {
      session: null,
      profile: null,
      routeParam: this.$route.params.id
    };
  },
  apollo: {
    profile: PROFILE_QUERY,
    session: {
      query: gql`
        ${SESSION_QUERY}
      `,
      variables() {
        return {
          id: this.routeParam
        };
      },
      subscribeToMore: {
        document: POST_QUESTION_SUBSCRIPTION,
        updateQuery: (
          previousData,
          {
            subscriptionData: {
              data: { postQuestion }
            }
          }
        ) => {
          return {
            ...previousData,
            session: {
              ...previousData.session,
              questions: previousData.session.questions.concat(postQuestion)
            }
          };
        }
      }
    }
  },
  computed: {
    questions() {
      return this.session && this.session.questions
        ? this.session.questions
        : [];
    }
  },
  components: {
    AuthLayout,
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
