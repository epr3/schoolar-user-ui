<template>
  <div class="container" v-if="remainingQuestions.length">
    <quiz-current-question
      :question="currentQuestion"
      :session-id="sessionId"
      @question:answer="answerQuestionAction"
    />
  </div>
  <div class="notification" v-else>No questions left.</div>
</template>

<script>
import { shuffle } from 'lodash';

import QuizCurrentQuestion from '../containers/QuizCurrentQuestion';

export default {
  name: 'student-question-view',
  data() {
    return {
      remainingQuestions: shuffle(this.questions),
      currentQuestion: null
    };
  },
  mounted() {
    if (this.questions.length === 0) {
      this.$emit('test:end');
    }
    this.currentQuestion = this.remainingQuestions[0];
  },
  props: {
    questions: {
      type: Array,
      required: true
    },
    sessionId: {
      type: String,
      required: true
    }
  },
  components: {
    QuizCurrentQuestion
  },
  methods: {
    answerQuestionAction() {
      this.remainingQuestions.shift();
      this.currentQuestion = { ...this.remainingQuestions[0] };
    }
  },
  watch: {
    remainingQuestions(val) {
      if (val.length === 0) {
        this.$emit('test:end');
      }
    }
  }
};
</script>
