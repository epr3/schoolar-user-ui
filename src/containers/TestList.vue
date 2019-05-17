<template>
  <div>
    <ul>
      <li></li>
    </ul>
  </div>
</template>

<script>
import TESTS_QUERY from '../graphql/Quiz/Tests.gql';

export default {
  name: 'test-list',
  data: () => ({
    tests: []
  }),
  apollo: {
    tests: TESTS_QUERY
  }
};
</script>
