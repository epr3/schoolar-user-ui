<template>
  <auth-layout>
    <div v-if="results.length" class="container">
      <results-item
        v-for="item in results"
        :key="item.id"
        :date="item.startPeriod"
        :subject="item.event.subject.name"
        :event-type="item.event.eventType.type"
        :no-of-questions="item.test.questions.length"
        :correct-answers="item.sessionAnswers.filter(answer => answer.isCorrect).length"
      />
    </div>
    <div class="container" v-else>
      <div class="notification">No results to show.</div>
    </div>
  </auth-layout>
</template>

<script>
import RESULTS_QUERY from '../graphql/Quiz/ResultsQuery.gql';

import AuthLayout from '../layouts/AuthLayout';
import ResultsItem from '../components/ResultsItem';

export default {
  name: 'results',
  data: () => ({
    results: []
  }),
  apollo: {
    results: RESULTS_QUERY
  },
  components: {
    AuthLayout,
    ResultsItem
  }
};
</script>
