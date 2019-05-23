<template>
  <auth-layout>
    <div class="hero is-info" v-if="quizSession">
      <div class="hero-body">
        <div class="container">
          <h2 class="title">Code: {{ quizSession.code }}</h2>
          <h3 class="subtitle">
            @{{ quizSession.event.subject.name }}
            {{ quizSession.startPeriod | humanDate }}
            - {{ quizSession.endPeriod | humanDate }}
          </h3>
        </div>
      </div>
    </div>
    <p>{{ quizSession }}</p>
    <div class="container" v-if="quizSession">
      <template v-if="quizSession.userSessions.length">
        <user-quiz-session-item
          v-for="item in quizSession.userSessions"
          :key="item.id"
          :user-id="item.userId"
        />
      </template>
      <div v-else class="notification">No students have joined the session yet.</div>
    </div>
  </auth-layout>
</template>

<script>
import gql from 'graphql-tag';

import QUIZ_SESSION from '../graphql/Quiz/ProfessorQuizSession.gql';
import JOIN_QUIZ_SESSION_SUBSCRIPTION from '../graphql/Quiz/ProfessorQuizSessionSubscription.gql';

import { DateTime } from 'luxon';

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
  filters: {
    humanDate(value) {
      return DateTime.fromISO(value).toFormat('dd MMM yyyy HH:mm');
    }
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
