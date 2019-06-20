<template>
  <auth-layout>
    <div class="container">
      <div class="card">
        <div class="card-content">
          <div class="content">
            <form>
              <div class="columns">
                <div class="column is-6">
                  <picture-input
                    ref="pictureInput"
                    width="300"
                    height="300"
                    margin="16"
                    accept="image/jpeg, image/png"
                    size="5"
                    button-class="button"
                    :custom-strings="{
                upload: '<h1>Bummer!</h1>',
                drag: 'Drag a picture here'
              }"
                    @change="onChange"
                  />
                </div>
                <div class="column is-6">
                  <base-markdown-editor
                    label="Description"
                    :v="$v.description"
                    placeholder="Type your question here"
                    v-model="description"
                  />
                </div>
              </div>

              <div class="columns is-multiline">
                <div class="column is-6" v-for="(item, index) in answers" :key="index">
                  <div class="card">
                    <div class="card-content">
                      <base-markdown-editor
                        :label="`Answer ${index + 1}`"
                        :v="$v.answers.$each[index].description"
                        placeholder="Type your answer here"
                        v-model="item.description"
                      />
                      <base-radio-button
                        :input-value="index.toString()"
                        v-model="correctAnswer"
                        name="isCorrect"
                        label="Is Correct?"
                        :v="$v.correctAnswer"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <hr>
          <div class="content">
            <div class="level">
              <div class="level-left">
                <div class="level-item">
                  <base-button @click="submitMethod" type="primary">Submit</base-button>
                </div>
              </div>
              <div class="level-right">
                <base-button @click="$router.go(-1)" type="danger">Cancel</base-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </auth-layout>
</template>

<script>
import POST_QUIZ_QUESTION from '../graphql/Quiz/PostQuizQuestion.gql';
import TEST_QUERY from '../graphql/Quiz/Test.gql';

import loadingMixin from '../mixins/loadingMixin';
import { validationMixin } from 'vuelidate';
import { required } from 'vuelidate/lib/validators';

import BaseMarkdownEditor from '@/components/BaseMarkdownEditor.vue';
import BaseButton from '@/components/BaseButton.vue';
import BaseRadioButton from '@/components/BaseRadioButton.vue';
import PictureInput from 'vue-picture-input';
import AuthLayout from '@/layouts/AuthLayout';
import errorHandler from '../utils/errorHandler';
export default {
  name: 'quiz-question-view',
  data: () => ({
    description: '',
    imagePath: '',
    correctAnswer: '',
    answers: [
      { description: '' },
      { description: '' },
      { description: '' },
      { description: '' }
    ]
  }),
  mixins: [validationMixin, loadingMixin],
  validations: {
    description: {
      required
    },
    correctAnswer: {
      required
    },
    answers: {
      $each: {
        description: {
          required
        }
      }
    }
  },
  components: {
    AuthLayout,
    BaseMarkdownEditor,
    BaseButton,
    BaseRadioButton,
    PictureInput
  },
  methods: {
    onChange(image) {
      if (image) {
        this.imagePath = image;
      } else {
        console.log('FileReader API not supported');
      }
    },
    async submitMethod() {
      if (!this.$v.$invalid) {
        this.loading = true;
        try {
          await this.$apollo.mutate({
            mutation: POST_QUIZ_QUESTION,
            variables: {
              question: {
                description: this.description,
                imagePath: this.imagePath,
                answers: this.answers.map((item, index) => ({
                  ...item,
                  isCorrect: this.correctAnswer == index
                })),
                testId: this.$route.params.id
              }
            },
            update: (store, { data: { postQuizQuestion } }) => {
              const data = store.readQuery({
                query: TEST_QUERY,
                variables: { id: this.$route.params.id }
              });
              data.test.questions.push(postQuizQuestion);
              store.writeQuery({
                query: TEST_QUERY,
                data,
                variables: { id: this.$route.params.id }
              });
            }
          });
          this.$router.go(-1);
        } catch (e) {
          errorHandler(e);
        }
        this.loading = false;
      }
    }
  }
};
</script>
