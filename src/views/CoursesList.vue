<template>
  <auth-layout>
    <div class="container" :style="{ marginTop: '16px' }">
      <div class="columns" v-for="item in subjects" :key="item.id">
        <div class="column">
          <div class="card">
            <div class="card-header">
              <h5 class="card-header-title">{{ item.name }}</h5>
              <base-button
                @click="() => openCourseModal({ subjectId: item.id })"
                type="info"
                v-if="profile && profile.professor"
              >Add Course</base-button>
            </div>
            <div class="card-content">
              <div class="columns is-multiline" v-if="item.courses.length">
                <div class="column is-3" v-for="course in item.courses" :key="course.id">
                  <div class="card">
                    <div class="card-header" :style="{ alignItems: 'center' }">
                      <h5 class="card-header-title">{{ course.name }}</h5>
                    </div>
                    <div class="card-content">
                      <a :href="course.coursePath" download target="_blank">
                        <font-awesome-icon icon="download"/>Download file
                      </a>
                    </div>
                    <div
                      class="card-footer"
                      v-if="profile && profile.professor && profile.user.id === course.userId"
                    >
                      <div
                        class="card-footer-item"
                        @click="deleteCourseAction(item.id, course.id, course.courseFilename)"
                      >Delete</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="notification" v-else>No courses added for this subject.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </auth-layout>
</template>

<script>
import gql from 'graphql-tag';

import { mapMutations } from 'vuex';

import SUBJECTS_QUERY from '../graphql/Subject/Subjects.gql';
import DELETE_COURSE from '../graphql/Course/DeleteCourse.gql';

import profileQueryMixin from '../mixins/profileQueryMixin';

import BaseButton from '../components/BaseButton';

import AuthLayout from '@/layouts/AuthLayout';
import errorHandler from '../utils/errorHandler';

export default {
  name: 'courses-list',
  data() {
    return {
      subjects: [],
      facultyId: this.$route.params.id
    };
  },
  mixins: [profileQueryMixin],
  apollo: {
    subjects: {
      query: gql`
        ${SUBJECTS_QUERY}
      `,
      variables() {
        return {
          facultyId: this.facultyId
        };
      }
    }
  },
  components: {
    BaseButton,
    AuthLayout
  },
  methods: {
    ...mapMutations({
      openModal: 'Modal/OPEN_MODAL'
    }),
    openCourseModal(props) {
      this.openModal({
        component: () => import('@/containers/CourseModal.vue'),
        props
      });
    },
    async deleteCourseAction(subjectId, id, courseFilename) {
      try {
        await this.$apollo.mutate({
          mutation: DELETE_COURSE,
          variables: {
            id,
            courseFilename
          },
          update: store => {
            const data = store.readQuery({
              query: SUBJECTS_QUERY,
              variables: { facultyId: this.$route.params.id }
            });
            store.writeQuery({
              query: SUBJECTS_QUERY,
              data: {
                ...data,
                subjects: data.subjects.map(item => {
                  if (item.id === subjectId) {
                    item.courses = item.courses.filter(
                      course => course.id !== id
                    );
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
  }
};
</script>
