<template>
  <base-modal-content
    :modal-title="`${question ? 'Edit question' : 'Add new question'}`"
    :modal-close-action="modalClose"
  >
    <template #modal-body>
      <form>
        <base-textarea
          label="Question"
          :v="$v.description"
          placeholder="Type your question here"
          v-model="description"
        />
      </form>
    </template>
    <template #modal-footer>
      <base-button @click="submitMethod" type="primary">Submit</base-button>
    </template>
  </base-modal-content>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

import POST_QUESTION from '../graphql/Question/PostQuestion.gql';
import UPDATE_QUESTION from '../graphql/Question/UpdateQuestion.gql';

import { validationMixin } from 'vuelidate';
import { required } from 'vuelidate/lib/validators';

import BaseTextarea from '@/components/BaseTextarea.vue';
import BaseButton from '@/components/BaseButton.vue';

import BaseModalContent from '@/components/BaseModalContent.vue';
import profileQueryMixin from '../mixins/profileQueryMixin';
import errorHandler from '../utils/errorHandler';

export default {
  name: 'question-modal',
  data: () => ({
    description: ''
  }),
  mixins: [profileQueryMixin, validationMixin],
  props: {
    question: {
      type: Object,
      default: null
    }
  },
  async mounted() {
    if (this.question) {
      this.description = this.question.description;
    }
  },
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
    async submitMethod() {
      if (!this.$v.$invalid) {
        if (this.question) {
          try {
            await this.$apollo.mutate({
              mutation: UPDATE_QUESTION,
              variables: {
                question: {
                  id: this.question.id,
                  sessionId: this.$route.params.id,
                  description: this.description,
                  userId: this.profile.user.id
                }
              }
            });
          } catch (e) {
            errorHandler(e);
          }
        } else {
          try {
            await this.$apollo.mutate({
              mutation: POST_QUESTION,
              variables: {
                question: {
                  sessionId: this.$route.params.id,
                  description: this.description,
                  userId: this.profile.user.id
                }
              }
            });
          } catch (e) {
            errorHandler(e);
          }
        }
        this.modalClose();
      }
    }
  },
  components: {
    BaseModalContent,
    BaseButton,
    BaseTextarea
  },
  validations: {
    description: {
      required
    }
  }
};
</script>
