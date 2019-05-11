<template>
  <base-modal-content
    :modal-title="`${id ? 'Edit question' : 'Add new question'}`"
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
import PROFILE_QUERY from '../graphql/Auth/Profile.gql';

import { validationMixin } from 'vuelidate';
import { required } from 'vuelidate/lib/validators';

import BaseTextarea from '@/components/BaseTextarea.vue';
import BaseButton from '@/components/BaseButton.vue';

import BaseModalContent from '@/components/BaseModalContent.vue';

export default {
  name: 'question-modal',
  data: () => ({
    description: '',
    profile: null
  }),
  apollo: {
    profile: PROFILE_QUERY
  },
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  async mounted() {
    if (this.id) {
      // const response = await this.$apollo.query({
      //   query: SUBJECT_QUERY,
      //   variables: { id: this.id }
      // });
      // this.name = response.data.subjectById.name;
      // this.credits = response.data.subjectById.credits;
      // this.facultyId = response.data.subjectById.facultyId;
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
    submitMethod() {
      if (!this.$v.$invalid) {
        if (this.id) {
        } else {
          try {
            this.$apollo.mutate({
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
            console.error(e);
          }
        }
        this.modalClose();
      }
    }
  },
  mixins: [validationMixin],
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
