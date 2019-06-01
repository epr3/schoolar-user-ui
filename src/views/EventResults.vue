<template>
  <auth-layout>
    <template v-if="event">
      <div class="hero is-dark">
        <div class="hero-body">
          <h4 class="title">{{ event.subject.name }}</h4>
          <h5 class="subtitle">{{ event.eventType.type }}</h5>
        </div>
      </div>
      <div class="container">
        <div v-if="event.results.length" class="columns is-multiline">
          <div v-for="item in event.results" :key="item.id" class="column is-3">
            <results-item
              :date="item.startPeriod"
              :no-of-questions="item.test.questions.length"
              :correct-answers="item.sessionAnswers.filter(answer => answer.isCorrect).length"
            />
          </div>
        </div>
        <div v-else class="notification">No results to show.</div>
      </div>
    </template>
  </auth-layout>
</template>

<script>
import gql from 'graphql-tag';
import EVENT_QUERY from '../graphql/Event/Event.gql';

import AuthLayout from '../layouts/AuthLayout';
import ResultsItem from '../components/ResultsItem';

export default {
  name: 'event-results',
  data() {
    return {
      event: null,
      routeParam: this.$route.params.id
    };
  },
  apollo: {
    event: {
      query: gql`
        ${EVENT_QUERY}
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
