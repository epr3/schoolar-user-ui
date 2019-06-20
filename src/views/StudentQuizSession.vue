<template>
  <auth-layout>
    <div class="hero is-dark">
      <div class="hero-body">
        <div class="container">
          <template v-if="quizSession">
            <h4 class="title">{{ quizSession.test.title }}</h4>
            <h5 class="subtitle">@{{ quizSession.test.subject.name }}</h5>
            <p>Status: {{ quizSession.userSession.status }}</p>
          </template>
          <base-button
            type="primary"
            v-if="!testStarted"
            @click="startTest"
            :disabled="loading"
          >Start test</base-button>
          <time-remaining
            v-else-if="quizSession && !testFinished && quizSession.userSession.startedAt"
            :join-date="quizSession.userSession.startedAt"
            :duration="quizSession.duration"
            @test:end="endTest"
          />
          <div v-if="testStarted && quizSession" class="content">
            Correct questions: {{ quizSession.userAnswers.filter(answer => answer.isCorrect).length }}
            Total questions: {{ quizSession.test.questions.length }}
          </div>
          <base-button
            :disabled="loading"
            @click="endTest"
            type="primary"
            v-if="testStarted && !testFinished"
          >Finish test</base-button>
          <h4 v-if="quizSession && testFinished" class="title">Score: {{ score }}%</h4>
        </div>
      </div>
    </div>
    <student-question-view
      v-if="quizSession && !testFinished && testStarted"
      :questions="quizSession.test.questions"
      :answers="quizSession.userAnswers"
      :session-id="quizSession.id"
      @test:end="endTest"
    />
  </auth-layout>
</template>

<script>
import gql from 'graphql-tag';

import { DateTime } from 'luxon';

import loadingMixin from '../mixins/loadingMixin';

import QUIZ_SESSION_QUERY from '../graphql/Quiz/StudentQuizSession.gql';
import START_QUIZ from '../graphql/Quiz/StartQuiz.gql';
import END_QUIZ from '../graphql/Quiz/EndQuiz.gql';

import AuthLayout from '../layouts/AuthLayout';

import BaseButton from '../components/BaseButton';
import TimeRemaining from '../components/TimeRemaining';
import StudentQuestionView from '../components/StudentQuestionView';
import errorHandler from '../utils/errorHandler';

export default {
  name: 'student-quiz-session',
  data() {
    return {
      quizSession: null,
      testStarted: false,
      testFinished: false,
      routeParam: this.$route.params.code,
      results: null
    };
  },
  mixins: [loadingMixin],
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
    StudentQuestionView,
    BaseButton
  },
  computed: {
    quizStatus() {
      return this.quizSession ? this.quizSession.userSession.status : 'joined';
    },
    score() {
      return this.quizSession
        ? (this.quizSession.userAnswers.reduce((acc, val) => {
            if (val.isCorrect) acc++;
            return acc;
          }, 0) /
            this.quizSession.test.questions.length) *
            100
        : 0;
    }
  },
  methods: {
    async endTest() {
      this.loading = true;
      try {
        await this.$apollo.mutate({
          mutation: END_QUIZ,
          variables: {
            sessionId: this.quizSession.id
          },
          update: (store, { data: { endQuiz } }) => {
            const data = store.readQuery({
              query: QUIZ_SESSION_QUERY,
              variables: { code: this.$route.params.code }
            });
            store.writeQuery({
              query: QUIZ_SESSION_QUERY,
              variables: { code: this.$route.params.code },
              data: {
                ...data,
                quizSession: {
                  ...data.quizSession,
                  userSession: {
                    ...endQuiz
                  }
                }
              }
            });
            this.testFinished = true;
          }
        });
      } catch (e) {
        errorHandler(e);
      }
      this.loading = false;
    },
    async startTest() {
      this.loading = true;
      try {
        await this.$apollo.mutate({
          mutation: START_QUIZ,
          variables: {
            sessionId: this.quizSession.id
          },
          update: (store, { data: { startQuiz } }) => {
            const data = store.readQuery({
              query: QUIZ_SESSION_QUERY,
              variables: { code: this.$route.params.code }
            });
            store.writeQuery({
              query: QUIZ_SESSION_QUERY,
              variables: { code: this.$route.params.code },
              data: {
                ...data,
                quizSession: {
                  ...data.quizSession,
                  userSession: {
                    ...startQuiz
                  }
                }
              }
            });
            this.testStarted = true;
          }
        });
      } catch (e) {
        errorHandler(e);
      }
      this.loading = false;
    }
  },
  watch: {
    quizStatus(val) {
      switch (val) {
        case 'started':
          this.testStarted = true;
          this.testFinished = false;
          break;
        case 'finished':
          this.testStarted = true;
          this.testFinished = true;
          break;
        default:
          this.testStarted = false;
          this.testFinished = false;
      }
    }
  }
};
</script>
