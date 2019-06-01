<template>
  <div class="container" v-if="remainingQuestions.length">
    <quiz-current-question
      v-if="currentQuestion"
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
      remainingQuestions: shuffle(
        this.questions.filter(
          question =>
            !this.answers.some(answer => answer.questionId === question.id)
        )
      ).map(question => ({ ...question, answers: shuffle(question.answers) })),
      currentQuestion: null
    };
  },
  mounted() {
    const currentQuestionId = localStorage.getItem('schoolar:question:current');
    if (currentQuestionId) {
      this.currentQuestion = this.remainingQuestions.find(
        item => item.id === currentQuestionId
      );
    } else {
      this.currentQuestion = this.remainingQuestions[0];
      localStorage.setItem(
        'schoolar:question:current',
        this.currentQuestion.id
      );
    }
  },
  props: {
    questions: {
      type: Array,
      required: true
    },
    answers: {
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
      if (this.remainingQuestions.length) {
        this.currentQuestion = { ...this.remainingQuestions[0] };
        localStorage.setItem(
          'schoolar:question:current',
          this.currentQuestion.id
        );
      } else {
        localStorage.removeItem('schoolar:question:current');
      }
    }
  }
};
</script>
