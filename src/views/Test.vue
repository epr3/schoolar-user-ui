<template>
  <auth-layout>
    <div class="container">
      <div class="card">
        <div class="card-header">
          <div class="card-header-title">{{ test && test.title }}</div>
        </div>
        <div class="card-content">
          <p v-if="test">{{ test.description }}</p>
        </div>
      </div>
    </div>
  </auth-layout>
</template>

<script>
import gql from 'graphql-tag';
import TEST_QUERY from '../graphql/Quiz/Test.gql';

import AuthLayout from '../layouts/AuthLayout';

export default {
  name: 'test',
  components: {
    AuthLayout
  },
  data() {
    return {
      test: null,
      routeParam: this.$route.params.id
    };
  },
  apollo: {
    test: {
      query: gql`
        ${TEST_QUERY}
      `,
      variables() {
        return {
          id: this.routeParam
        };
      }
    }
  }
};
</script>
