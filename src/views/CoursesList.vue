<template>
  <auth-layout>
    <div class="container" :style="{ marginTop: '16px' }" v-if="subjects">
      <div class="columns" v-for="item in subjects" :key="item.id">
        <div class="column">
          <div class="card">
            <div class="card-header">
              <h5 class="card-header-title">{{ item.name }}</h5>
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
      </div>
    </div>
    <div class="container" v-else>
      <div class="notification">Faculty does not have any subjects added.</div>
    </div>
  </auth-layout>
</template>

<script>
import gql from 'graphql-tag';

import SUBJECTS_QUERY from '../graphql/Subject/SubjectsByFacultyId.gql';

import loadingMixin from '../mixins/loadingMixin';
import profileQueryMixin from '../mixins/profileQueryMixin';

import AuthLayout from '@/layouts/AuthLayout';

export default {
  name: 'courses-list',
  data() {
    return {
      subjects: [],
      facultyId: this.$route.params.id
    };
  },
  mixins: [profileQueryMixin, loadingMixin],
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
    AuthLayout
  }
};
</script>
