<template>
  <div class="card">
    <div class="card-content">
      <div class="content">
        <img
          v-if="question.imagePath"
          :src="question.imagePath"
          alt="question-image"
        />
        <p v-html="previewText" />
      </div>
      <base-radio-button
        v-for="item in question.answers"
        :input-value="item.id"
        v-model="currentAnswer"
        name="currentAnswer"
        :label="item.description"
        :v="$v.currentAnswer"
        :key="item.id"
      />
      <base-button type="primary">Submit</base-button>
    </div>
  </div>
</template>

<script>
import marked from 'marked';

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
  }
};
</script>
