<template>
  <auth-layout>
    <div class="container" :style="{ padding: '1em' }">
      <div class="card">
        <div class="card-header" v-if="subject">
          <h5 class="title">{{ subject.name }}</h5>
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
                  <p
                    class="content"
                  >By {{ course.professor.title }} {{ course.professor.name }} {{ course.professor.surname }}</p>
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

import SUBJECT_QUERY from '../graphql/Subject/Subject.gql';
import COURSES_QUERY from '../graphql/Course/CoursesByQuery.gql';

import AuthLayout from '@/layouts/AuthLayout';

export default {
  name: 'courses-subject',
  data() {
    return {
      routeParam: this.$route.params.id,
      coursesByQuery: [],
      subject: null
    };
  },
  components: {
    AuthLayout
  },
  apollo: {
    subject: {
      query: gql`
        ${SUBJECT_QUERY}
      `,
      variables() {
        return {
          id: this.routeParam
        };
      }
    },
    coursesByQuery: {
      query: gql`
        ${COURSES_QUERY}
      `,
      variables() {
        return {
          subjectId: this.routeParam
        };
      }
    }
  }
};
</script>
