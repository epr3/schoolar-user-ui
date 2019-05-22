<template>
  <base-modal-content modal-title="Add new question" :modal-close-action="modalClose">
    <template #modal-body>
      <form>
        <picture-input
          ref="pictureInput"
          width="400"
          height="200"
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
        <base-markdown-editor
          label="Description"
          :v="$v.description"
          placeholder="Type your question here"
          v-model="description"
        />
        <div class="card" v-for="(item, index) in answers" :key="index">
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
      </form>
    </template>
    <template #modal-footer>
      <base-button @click="submitMethod" type="primary">Submit</base-button>
    </template>
  </base-modal-content>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

import POST_QUIZ_QUESTION from '../graphql/Quiz/PostQuizQuestion.gql';
import TEST_QUERY from '../graphql/Quiz/Test.gql';

import { validationMixin } from 'vuelidate';
import { required } from 'vuelidate/lib/validators';

import BaseMarkdownEditor from '@/components/BaseMarkdownEditor.vue';
import BaseButton from '@/components/BaseButton.vue';
import BaseRadioButton from '@/components/BaseRadioButton.vue';
import PictureInput from 'vue-picture-input';

import BaseModalContent from '@/components/BaseModalContent.vue';

export default {
  name: 'quiz-question-modal',
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
  mixins: [validationMixin],
  computed: {
    ...mapState('Modal', ['modalOpen', 'modalComponent'])
  },
  methods: {
    ...mapMutations({
      modalClose: 'Modal/CLOSE_MODAL'
    }),
    modalCloseAction() {
      this.modalClose();
    },
    onChange(image) {
      if (image) {
        this.imagePath = image;
      } else {
        console.log('FileReader API not supported');
      }
    },
    submitMethod() {
      if (!this.$v.$invalid) {
        try {
          this.$apollo.mutate({
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
        } catch (e) {
          console.error(e);
        }
        this.modalClose();
      }
    }
  },
  components: {
    BaseModalContent,
    BaseButton,
    BaseMarkdownEditor,
    PictureInput,
    BaseRadioButton
  },
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
  }
};
</script>
