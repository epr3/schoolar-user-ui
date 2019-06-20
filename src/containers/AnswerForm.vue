<template>
  <form>
    <base-textarea
      label="Answer"
      :v="$v.description"
      placeholder="Type your answer here"
      v-model="description"
    />
    <base-button @click="submitMethod" type="primary" :disabled="loading">Submit</base-button>
  </form>
</template>

<script>
import POST_ANSWER from '../graphql/Answer/PostAnswer.gql';
import UPDATE_ANSWER from '../graphql/Answer/UpdateAnswer.gql';
import ANSWER_QUERY from '../graphql/Answer/Answer.gql';

import loadingMixin from '../mixins/loadingMixin';
import { validationMixin } from 'vuelidate';
import { required } from 'vuelidate/lib/validators';

import BaseTextarea from '../components/BaseTextarea.vue';
import BaseButton from '../components/BaseButton.vue';
import errorHandler from '../utils/errorHandler';

export default {
  name: 'answer-form',
  data: () => ({
    description: ''
  }),
  components: {
    BaseTextarea,
    BaseButton
  },
  async mounted() {
    if (this.id) {
      const response = await this.$apollo.query({
        query: ANSWER_QUERY,
        variables: {
          id: this.id
        }
      });
      this.description = response.data.answer.description;
    } else {
      this.description = '';
    }
  },
  props: {
    id: {
      type: String,
      default: ''
    },
    questionId: {
      type: String,
      required: true
    }
  },
  mixins: [validationMixin, loadingMixin],
  validations: {
    description: {
      required
    }
  },
  methods: {
    submitMethod() {
      if (!this.$v.$invalid) {
        this.loading = true;
        if (this.id) {
          try {
            this.$apollo.mutate({
              mutation: UPDATE_ANSWER,
              variables: {
                answer: {
                  id: this.id,
                  questionId: this.questionId,
                  description: this.description
                }
              }
            });
            this.description = '';
            this.$emit('reset:form');
          } catch (e) {
            errorHandler(e);
          }
        } else {
          try {
            this.$apollo.mutate({
              mutation: POST_ANSWER,
              variables: {
                answer: {
                  questionId: this.questionId,
                  description: this.description
                }
              }
            });
            this.description = '';
            this.$emit('reset:form');
          } catch (e) {
            errorHandler(e);
          }
          this.loading = false;
        }
      }
    }
  }
};
</script>
