<template>
  <div class="container">
    <base-button type="primary" @click="openTestModal">Create test</base-button>
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
</template>

<script>
import { mapMutations } from 'vuex';

import TESTS_QUERY from '../graphql/Quiz/Tests.gql';

import TestItem from '../components/TestItem';
import BaseButton from '../components/BaseButton';

export default {
  name: 'test-list',
  components: {
    BaseButton,
    TestItem
  },
  data: () => ({
    tests: []
  }),
  apollo: {
    tests: TESTS_QUERY
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
