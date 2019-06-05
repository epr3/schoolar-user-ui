<template>
  <base-modal-content modal-title="Add new course" :modal-close-action="modalClose">
    <template #modal-body>
      <form>
        <base-input
          type="text"
          :name="name"
          label="Name"
          :v="$v.name"
          placeholder="Course name"
          v-model="name"
        />
        <base-file-input v-model="courseFile" :v="$v.courseFile"/>
      </form>
    </template>
    <template #modal-footer>
      <base-button @click="submitMethod" type="primary">Submit</base-button>
    </template>
  </base-modal-content>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

import SUBJECTS_QUERY from '../graphql/Subject/Subjects.gql';
import POST_COURSE from '../graphql/Course/PostCourse.gql';

import { validationMixin } from 'vuelidate';
import { required } from 'vuelidate/lib/validators';

import profileQueryMixin from '../mixins/profileQueryMixin';

import BaseInput from '@/components/BaseInput.vue';
import BaseFileInput from '@/components/BaseFileInput.vue';
import BaseButton from '@/components/BaseButton.vue';

import BaseModalContent from '@/components/BaseModalContent.vue';

import errorHandler from '../utils/errorHandler';

export default {
  name: 'course-modal',
  data: () => ({
    name: '',
    courseFile: null
  }),
  mixins: [profileQueryMixin, validationMixin],
  props: {
    subjectId: {
      type: String,
      required: true
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
        try {
          await this.$apollo.mutate({
            mutation: POST_COURSE,
            variables: {
              course: {
                courseFile: this.courseFile,
                name: this.name,
                subjectId: this.subjectId,
                userId: this.profile.user.id
              }
            },
            update: (store, { data: { postCourse } }) => {
              const data = store.readQuery({
                query: SUBJECTS_QUERY,
                variables: { facultyId: this.$route.params.id }
              });
              store.writeQuery({
                query: SUBJECTS_QUERY,
                data: {
                  ...data,
                  subjects: data.subjects.map(item => {
                    if (item.id === postCourse.subjectId) {
                      item.courses.push(postCourse);
                    }
                    return item;
                  })
                },
                variables: { facultyId: this.$route.params.id }
              });
            }
          });
        } catch (e) {
          errorHandler(e);
        }
      }
      this.modalClose();
    }
  },
  components: {
    BaseModalContent,
    BaseButton,
    BaseInput,
    BaseFileInput
  },
  validations: {
    name: {
      required
    },
    courseFile: {
      required
    }
  }
};
</script>
