<template>
  <auth-layout>
    <div class="container" :style="{ padding: '1rem' }">
      <div class="card">
        <div class="card-header">
          <base-button type="primary" @click="openCourseModal">Add Course</base-button>
        </div>
        <div class="card-content">
          <div class="columns is-multiline" v-if="coursesByQuery.length">
            <div class="column is-3" v-for="course in coursesByQuery" :key="course.id">
              <div class="card">
                <div class="card-header" :style="{ alignItems: 'center' }">
                  <h5 class="card-header-title">{{ course.name }}</h5>
                </div>
                <div class="card-content">
                  <a :href="course.coursePath" download target="_blank">
                    <font-awesome-icon icon="download"/>Download file
                  </a>
                  <div
                    class="content"
                  >By {{ course.professor.title }} {{ course.professor.name }} {{ course.professor.surname }}</div>
                </div>
                <div class="card-footer">
                  <div class="card-footer-item">
                    <base-button
                      :disabled="loading"
                      @click="deleteCourseAction(course.id, course.courseFilename)"
                      type="primary"
                    >Delete</base-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="notification" v-else>No courses added for this subject.</div>
        </div>
      </div>
    </div>
  </auth-layout>
</template>

<script>
import gql from 'graphql-tag';

import { mapMutations } from 'vuex';

import COURSES_QUERY from '../graphql/Course/CoursesByQuery.gql';
import DELETE_COURSE from '../graphql/Course/DeleteCourse.gql';

import errorHandler from '../utils/errorHandler';

import loadingMixin from '../mixins/loadingMixin';

import AuthLayout from '@/layouts/AuthLayout';
import BaseButton from '@/components/BaseButton';

export default {
  name: 'courses-user',
  data() {
    return {
      routeParam: this.$route.params.id,
      coursesByQuery: []
    };
  },
  components: {
    AuthLayout,
    BaseButton
  },
  mixins: [loadingMixin],
  apollo: {
    coursesByQuery: {
      query: gql`
        ${COURSES_QUERY}
      `,
      variables() {
        return {
          userId: this.routeParam
        };
      }
    }
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
    async deleteCourseAction(id, courseFilename) {
      if (!this.loading) {
        this.loading = true;
        try {
          await this.$apollo.mutate({
            mutation: DELETE_COURSE,
            variables: {
              id,
              courseFilename
            },
            update: store => {
              const data = store.readQuery({
                query: COURSES_QUERY,
                variables: { userId: this.routeParam }
              });
              store.writeQuery({
                query: COURSES_QUERY,
                variables: { userId: this.routeParam },
                data: {
                  ...data,
                  coursesByQuery: data.coursesByQuery.filter(item => item.id !== id)
                }
              });
            }
          });
        } catch (e) {
          errorHandler(e);
        }
        this.loading = false;
      }
    }
  }
};
</script>
