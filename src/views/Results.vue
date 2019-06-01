<template>
  <auth-layout>
    <div class="hero is-dark">
      <div class="hero-body">
        <h4 class="title">All Results</h4>
      </div>
    </div>
    <div class="container">
      <div v-if="results.length" class="columns is-multiline">
        <div v-for="item in results" :key="item.id" class="column is-3">
          <results-item
            :subject="item.event.subject.name"
            :event-type="item.event.eventType.type"
            :date="item.startPeriod"
            :no-of-questions="item.test.questions.length"
            :correct-answers="item.sessionAnswers.filter(answer => answer.isCorrect).length"
          />
        </div>
      </div>
      <div v-else class="notification">No results to show.</div>
    </div>
  </auth-layout>
</template>

<script>
import gql from 'graphql-tag';
import RESULTS_QUERY from '../graphql/Quiz/ResultsQuery.gql';

import AuthLayout from '../layouts/AuthLayout';
import ResultsItem from '../components/ResultsItem';

export default {
  name: 'results',
  data() {
    return {
      results: [],
      routeParam: this.$route.params.id
    };
  },
  apollo: {
    results: {
      query: gql`
        ${RESULTS_QUERY}
      `,
      variables() {
        return {
          id: this.routeParam
        };
      }
    }
  },
  components: {
    AuthLayout,
    ResultsItem
  }
};
</script>
