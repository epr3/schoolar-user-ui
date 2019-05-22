<template>
  <p>{{ student }}</p>
</template>

<script>
import gql from 'graphql-tag';
import STUDENT_QUERY from '../graphql/Student/Student.gql';

export default {
  name: 'user-quiz-session-item',
  data: () => ({
    student: null
  }),
  apollo: {
    student: {
      query: gql`
        ${STUDENT_QUERY}
      `,
      variables() {
        return {
          userId: this.userId
        };
      }
    }
  },
  props: {
    userId: {
      type: String,
      required: true
    }
  }
};
</script>
