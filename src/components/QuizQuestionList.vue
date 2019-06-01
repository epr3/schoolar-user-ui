<template>
  <ul v-if="questions.length">
    <li v-for="item in questions" :key="item.id">
      <quiz-question-item
        :description="item.description"
        :image-path="item.imagePath"
        :delete-action="() => deleteQuestion(item.id)"
      />
    </li>
  </ul>
  <div v-else class="notification">No questions yet.</div>
</template>

<script>
import QuizQuestionItem from '../components/QuizQuestionItem';

import TEST_QUERY from '../graphql/Quiz/Test.gql';
import DELETE_QUIZ_QUESTION from '../graphql/Quiz/DeleteQuizQuestion.gql';

import errorHandler from '../utils/errorHandler';

export default {
  name: 'quiz-question-list',
  components: {
    QuizQuestionItem
  },
  props: {
    questions: {
      type: Array,
      required: true
    }
  },
  methods: {
    deleteQuestion(id) {
      try {
        this.$apollo.mutate({
          mutation: DELETE_QUIZ_QUESTION,
          variables: {
            id
          },
          update: store => {
            const data = store.readQuery({
              query: TEST_QUERY,
              variables: { id: this.$route.params.id }
            });
            store.writeQuery({
              query: TEST_QUERY,
              variables: { id: this.$route.params.id },
              data: {
                ...data,
                test: {
                  ...data.test,
                  questions: data.test.questions.filter(item => item.id !== id)
                }
              }
            });
          }
        });
      } catch (e) {
        errorHandler(e);
      }
    }
  }
};
</script>
