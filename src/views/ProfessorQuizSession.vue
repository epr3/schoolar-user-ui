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
    <div class="container" v-if="quizSession">
      <template v-if="quizSession.userSessions.length">
        <!-- <GChart type="BarChart" :data="scoreChartData" :options="scoreChartOptions" /> -->
        <user-quiz-session-item
          v-for="item in quizSession.userSessions"
          :score="quizSession.score"
          :key="item.id"
          :user-id="item.userId"
          :status="item.status"
          :answers="quizSession.userAnswers.filter(answer => answer.userId === item.userId)"
          :no-of-questions="quizSession.test.questions.length"
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
import SUBMIT_ANSWER_SUBSCRIPTION from '../graphql/Quiz/QuizAnswerSubscription.gql';
import END_QUIZ_SUBSCRIPTION from '../graphql/Quiz/QuizEndSubscription.gql';

import { DateTime } from 'luxon';

import { GChart } from 'vue-google-charts';

import UserQuizSessionItem from '../containers/UserQuizSessionItem';

import AuthLayout from '../layouts/AuthLayout';

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
          document: END_QUIZ_SUBSCRIPTION,
          updateQuery: (
            previousData,
            { subscriptionData: { data: endQuizSession } }
          ) => ({
            ...previousData,
            quizSession: {
              ...previousData.quizSession,
              userSessions: previousData.quizSession.userSessions.map(item => {
                if (item.id === endQuizSession.id) {
                  return endQuizSession;
                }

                return item;
              })
            }
          })
        },
        {
          document: SUBMIT_ANSWER_SUBSCRIPTION,
          updateQuery: (
            previousData,
            {
              subscriptionData: {
                data: { submitQuestionAnswer }
              }
            }
          ) => ({
            ...previousData,
            quizSession: {
              ...previousData.quizSession,
              userAnswers: previousData.quizSession.userAnswers.concat(
                submitQuestionAnswer
              )
            }
          })
        },
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
  computed: {
    scoreChartData() {
      const answers = this.quizSession.userAnswers.reduce((acc, item) => {
        if (acc.hasOwnProperty(item.userId)) {
          acc[item.userId]++;
        } else {
          acc[item.userId] = 0;
        }
        return acc;
      }, {});
      const correctAnswers = Object.keys(answers)
      const scores = Object.keys(correctAnswers).map(
        item =>
          (correctAnswers[item] * this.quizSession.score) /
          this.quizSession.test.questions.length
      );
      const chartScores = scores.map(item => [
        Math.round(item / 10),
        scores.filter(score => Math.round(score / 10) === Math.round(item / 10))
          .length
      ]);
      return [['Score', '# of students'], ...chartScores];
    },
    scoreChartOptions() {
      return {
        title: 'Test results',
        chartArea: { width: '75%' },
        hAxis: {
          title: 'Number of students',
          minValue: 0
        },
        vAxis: {
          title: 'Grades'
        }
      };
    }
  },
  components: {
    GChart,
    AuthLayout,
    UserQuizSessionItem
  }
};
</script>
