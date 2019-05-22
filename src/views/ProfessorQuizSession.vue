<template>
  <auth-layout>
    <p>{{ quizSession }}</p>
    <div v-if="quizSession">
      <user-quiz-session-item
        v-for="item in quizSession.userSessions"
        :key="item.id"
        :user-id="item.userId"
      />
    </div>
  </auth-layout>
</template>

<script>
import gql from 'graphql-tag';

import QUIZ_SESSION from '../graphql/Quiz/ProfessorQuizSession.gql';
import JOIN_QUIZ_SESSION_SUBSCRIPTION from '../graphql/Quiz/ProfessorQuizSessionSubscription.gql';

import UserQuizSessionItem from '../containers/UserQuizSessionItem';

import AuthLayout from '../layouts/AuthLayout';

import BaseTable from '../components/BaseTable';

export default {
  name: 'professor-quiz-session',
  data() {
    return {
      quizSession: null,
      routeParam: this.$route.params.id,
      userSessions: []
    };
  },
  apollo: {
    quizSession: {
      query: gql`
        ${QUIZ_SESSION}
      `,
      variables() {
        return {
          id: this.routeParam
        };
      },
      subscribeToMore: [
        {
          document: JOIN_QUIZ_SESSION_SUBSCRIPTION,
          updateQuery: (
            previousData,
            {
              subscriptionData: {
                data: { postJoinQuizSession }
              }
            }
          ) => {
            const {
              quizSession: { userSessions }
            } = previousData;

            return {
              ...previousData,
              quizSession: {
                ...previousData.quizSession,
                userSessions: userSessions.concat(postJoinQuizSession)
              }
            };
          }
        }
      ]
    }
  },
  components: {
    BaseTable,
    AuthLayout,
    UserQuizSessionItem
  }
};
</script>
