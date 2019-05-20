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
      <div class="column">{{ sessions }}</div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';

import TESTS_QUERY from '../graphql/Quiz/Tests.gql';
import SESSIONS_QUERY from '../graphql/Quiz/QuizSessions.gql';

import TestItem from '../components/TestItem';
import BaseButton from '../components/BaseButton';

export default {
  name: 'test-list',
  components: {
    BaseButton,
    TestItem
  },
  data: () => ({
    tests: [],
    sessions: []
  }),
  apollo: {
    tests: TESTS_QUERY,
    sessions: SESSIONS_QUERY
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
