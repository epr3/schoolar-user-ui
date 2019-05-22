<template>
  <div class="container">
    <base-button type="primary" @click="openTestModal">Create test</base-button>
    <div class="columns">
      <div class="column">
        <ul v-if="tests.length">
          <li v-for="item in tests" :key="item.id">
            <test-item
              :id="item.id"
              :title="item.title"
              :description="item.description"
              :subject="item.subject.name"
              :number-of-questions="item.questions ? item.questions.length : 0"
            />
          </li>
        </ul>
        <div v-else class="notification">No tests to show.</div>
      </div>
      <div class="column">
        <ul v-if="quizSessions.length">
          <li v-for="item in quizSessions" :key="item.id">
            <quiz-session-item
              :id="item.id"
              :code="item.code"
              :score="item.score"
              :duration="item.duration"
              :subject="item.event.subject.name"
              :start-period="item.startPeriod"
              :end-period="item.endPeriod"
            />
          </li>
        </ul>
        <div v-else class="notification">No sessions to show.</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';

import TESTS_QUERY from '../graphql/Quiz/Tests.gql';
import SESSIONS_QUERY from '../graphql/Quiz/QuizSessions.gql';

import TestItem from '../components/TestItem';
import QuizSessionItem from '../components/QuizSessionItem';
import BaseButton from '../components/BaseButton';

export default {
  name: 'test-list',
  components: {
    BaseButton,
    TestItem,
    QuizSessionItem
  },
  data: () => ({
    tests: [],
    quizSessions: []
  }),
  apollo: {
    tests: TESTS_QUERY,
    quizSessions: SESSIONS_QUERY
  },
  methods: {
    ...mapMutations({
      openModal: 'Modal/OPEN_MODAL',
      modalClose: 'Modal/CLOSE_MODAL'
    }),
    openTestModal(props) {
      this.openModal({
        component: () => import('@/containers/TestModal.vue'),
        props
      });
    }
  }
};
</script>
