<template>
  <div class="box">
    <div class="media">
      <div class="media-content">
        <div v-if="student" class="content">
          <p>
            <strong>{{ student.name }} {{ student.surname }}</strong>
          </p>
          <p>
            <small>Group: {{ student.group.number }}</small>
          </p>
          <p>
            <small>Test status: {{ status }}</small>
          </p>
          <p>
            <strong>
              {{ correctAnswers }}/{{ noOfQuestions }} correct
              {{ (correctAnswers * score) / noOfQuestions }}% score
            </strong>
          </p>
        </div>
      </div>
    </div>
  </div>
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
    },
    status: {
      type: String,
      required: true
    },
    answers: {
      type: Array,
      required: true
    },
    noOfQuestions: {
      type: Number,
      required: true
    },
    score: {
      type: Number,
      required: true
    }
  },
  computed: {
    correctAnswers() {
      return this.answers.reduce((acc, val) => {
        if (val.isCorrect) {
          acc++;
        }
        return acc;
      }, 0);
    }
  }
};
</script>
