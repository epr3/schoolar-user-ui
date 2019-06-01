<template>
  <div class="card">
    <div class="card-content">
      <div class="content">
        <img v-if="question.imagePath" :src="question.imagePath" alt="question-image">
        <p v-html="previewText"/>
      </div>
      <div class="field is-grouped" v-for="item in question.answers" :key="item.id">
        <base-radio-button
          :input-value="item.id"
          v-model="currentAnswer"
          name="currentAnswer"
          :v="$v.currentAnswer"
        />
        <p v-html="convertToHTML(item.description)"/>
      </div>

      <base-button type="primary" @click="submitAnswer">Submit</base-button>
    </div>
  </div>
</template>

<script>
import marked from 'marked';

import QUIZ_SESSION_QUERY from '../graphql/Quiz/StudentQuizSession.gql';
import SUBMIT_ANSWER from '../graphql/Quiz/SubmitQuizQuestionAnswer.gql';

import { validationMixin } from 'vuelidate';
import { required } from 'vuelidate/lib/validators';

import BaseRadioButton from '../components/BaseRadioButton';
import BaseButton from '../components/BaseButton';

export default {
  name: 'quiz-current-question',
  data: () => ({
    currentAnswer: ''
  }),
  mixins: [validationMixin],
  validations: {
    currentAnswer: {
      required
    }
  },
  props: {
    question: {
      type: Object,
      required: true
    },
    sessionId: {
      type: String,
      required: true
    }
  },
  components: {
    BaseRadioButton,
    BaseButton
  },
  computed: {
    previewText() {
      marked.setOptions({
        renderer: new marked.Renderer(),
        gfm: true,
        tables: true,
        breaks: true,
        pedantic: false,
        sanitize: true,
        smartLists: true,
        smartypants: false
      });
      return marked(this.question.description);
    }
  },
  methods: {
    async submitAnswer() {
      try {
        await this.$apollo.mutate({
          mutation: SUBMIT_ANSWER,
          variables: {
            answer: {
              sessionId: this.sessionId,
              answerId: this.currentAnswer,
              questionId: this.question.id
            }
          },
          update: (store, { data: { submitQuizQuestionAnswer } }) => {
            const data = store.readQuery({
              query: QUIZ_SESSION_QUERY,
              variables: { code: this.$route.params.code }
            });
            data.quizSession.userAnswers.push(submitQuizQuestionAnswer);
            store.writeQuery({
              query: QUIZ_SESSION_QUERY,
              variables: { code: this.$route.params.code },
              data
            });
          }
        });
        this.$emit('question:answer');
      } catch (e) {
        console.error(e);
      }
    },
    convertToHTML(text) {
      marked.setOptions({
        renderer: new marked.Renderer(),
        gfm: true,
        tables: true,
        breaks: true,
        pedantic: false,
        sanitize: true,
        smartLists: true,
        smartypants: false
      });
      return marked(text);
    }
  }
};
</script>
