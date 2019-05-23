<template>
  <div class="container" v-if="remainingQuestions.length">
    <quiz-current-question :question="remainingQuestions[0]" />
  </div>
  <div class="notification" v-else>
    No questions left.
  </div>
</template>

<script>
import { shuffle } from 'lodash';

import QuizCurrentQuestion from '../containers/QuizCurrentQuestion';

export default {
  name: 'student-question-view',
  data() {
    return {
      remainingQuestions: shuffle(this.questions)
    };
  },
  props: {
    questions: {
      type: Array,
      required: true
    }
  },
  components: {
    QuizCurrentQuestion
  }
};
</script>
