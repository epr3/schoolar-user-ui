<template>
  <auth-layout>
    <p>{{ quizSession }}</p>
  </auth-layout>
</template>

<script>
import gql from 'graphql-tag';

import QUIZ_SESSION from '../graphql/Quiz/ProfessorQuizSession.gql';
import JOIN_QUIZ_SESSION_SUBSCRIPTION from '../graphql/Quiz/ProfessorQuizSessionSubscription.gql';

import AuthLayout from '../layouts/AuthLayout';

import BaseTable from '../components/BaseTable';

export default {
  name: 'professor-quiz-session',
  data() {
    return {
      quizSession: null,
      routeParam: this.$route.params.id
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
          ) => ({
            ...previousData,
            quizSession: {
              ...previousData.quizSession,
              userSessions: previousData.quizSession.userSessions.concat(
                postJoinQuizSession
              )
            }
          })
        }
      ]
    }
  },
  components: {
    BaseTable,
    AuthLayout
  }
};
</script>
