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
        <base-select label="Subject" :v="$v.subjectId" v-model="subjectId" :options="subjectSelect"/>
      </form>
    </template>
    <template #modal-footer>
      <base-button @click="submitMethod" type="primary" :disabled="loading">Submit</base-button>
    </template>
  </base-modal-content>
</template>

<script>
import gql from 'graphql-tag';
import { mapState, mapMutations } from 'vuex';

import SUBJECTS_QUERY from '../graphql/Subject/SubjectsByUserId.gql';
import COURSES_QUERY from '../graphql/Course/CoursesByQuery.gql';
import POST_COURSE from '../graphql/Course/PostCourse.gql';

import loadingMixin from '../mixins/loadingMixin';
import { validationMixin } from 'vuelidate';
import { required } from 'vuelidate/lib/validators';

import profileQueryMixin from '../mixins/profileQueryMixin';

import BaseInput from '@/components/BaseInput.vue';
import BaseSelect from '@/components/BaseSelect.vue';
import BaseFileInput from '@/components/BaseFileInput.vue';
import BaseButton from '@/components/BaseButton.vue';

import BaseModalContent from '@/components/BaseModalContent.vue';

import errorHandler from '../utils/errorHandler';

export default {
  name: 'course-modal',
  data: () => ({
    name: '',
    courseFile: null,
    subjectsByUserId: [],
    subjectId: null
  }),
  mixins: [profileQueryMixin, validationMixin, loadingMixin],
  apollo: {
    subjectsByUserId: {
      query: gql`
        ${SUBJECTS_QUERY}
      `,
      variables() {
        return {
          userId: this.profile.user.id
        };
      }
    }
  },
  computed: {
    ...mapState('Modal', ['modalOpen', 'modalComponent']),
    subjectSelect() {
      const nullObj = { id: 'rdgfewar', value: null, label: 'None' };
      return this.subjectsByUserId.length
        ? [
            nullObj,
            ...this.subjectsByUserId.map(item => ({
              label: item.name,
              value: item.id
            }))
          ]
        : [nullObj];
    }
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
        this.loading = true;
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
                query: COURSES_QUERY,
                variables: { userId: this.profile.user.id }
              });
              data.coursesByQuery.push(postCourse);
              store.writeQuery({
                query: COURSES_QUERY,
                data,
                variables: { userId: this.profile.user.id }
              });
            }
          });
          this.modalClose();
        } catch (e) {
          errorHandler(e);
        }
      }
      this.loading = false;
    }
  },
  components: {
    BaseModalContent,
    BaseButton,
    BaseInput,
    BaseFileInput,
    BaseSelect
  },
  validations: {
    name: {
      required
    },
    courseFile: {
      required
    },
    subjectId: {
      required
    }
  }
};
</script>
