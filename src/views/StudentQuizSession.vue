<template>
  <auth-layout>
    <div class="hero is-info" v-if="quizSession">
      <div class="hero-body">
        <div class="container">
          <time-remaining
            v-if="quizSession"
            :join-date="quizSession.userSession.joinedAt"
            :duration="quizSession.duration"
            @test:end="endTest"
          />
        </div>
      </div>
    </div>

    <student-question-view
      v-if="quizSession && !testFinished"
      :questions="quizSession.test.questions"
    />
  </auth-layout>
</template>

<script>
import gql from 'graphql-tag';

import { DateTime } from 'luxon';

import QUIZ_SESSION_QUERY from '../graphql/Quiz/StudentQuizSession.gql';

import AuthLayout from '../layouts/AuthLayout';

import TimeRemaining from '../components/TimeRemaining';
import StudentQuestionView from '../components/StudentQuestionView';
import BaseButton from '../components/BaseButton';

export default {
  name: 'student-quiz-session',
  data() {
    return {
      quizSession: null,
      testFinished: false,
      routeParam: this.$route.params.code,
      results: null
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
        ${QUIZ_SESSION_QUERY}
      `,
      variables() {
        return {
          code: this.routeParam
        };
      }
    }
  },
  components: {
    AuthLayout,
    TimeRemaining,
    StudentQuestionView
  },
  methods: {
    endTest() {
      this.testFinished = true;
      console.log(this.quizSession.id);
      this.$router.replace('/quiz/join');
      console.log('testEnd');
    }
  }
};
</script>
