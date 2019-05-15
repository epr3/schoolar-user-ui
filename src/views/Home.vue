<template>
  <auth-layout>
    <img alt="Vue logo" src="../assets/logo.png">
    {{ profile }}
    <p v-if="profile && profile.role === 'PROFESSOR'">Professor</p>
    <p v-if="profile && profile.role === 'STUDENT'">Student</p>
    <input type="file" @change="previewFiles" />
    <button @click="uploadFile" class="btn">Test file upload</button>
  </auth-layout>
</template>

<script>
import UPLOAD_FILE from '../graphql/Quiz/UploadFile.gql';

import AuthLayout from '../layouts/AuthLayout.vue';

import profileQueryMixin from '../mixins/profileQueryMixin';

export default {
  name: 'home',
  data: () => ({
    files: []
  }),
  mixins: [profileQueryMixin],
  components: {
    AuthLayout
  },
  methods: {
    previewFiles(event) {
      this.files = event.target.files;
      console.log(this.files[0]);
    },
    async uploadFile() {
      try {
        const response = await this.$apollo.mutate({
          mutation: UPLOAD_FILE,
          variables: {
            file: this.files[0]
          }
        });
        console.log(response);
      } catch (e) {
        console.log(e);
      }
    }
  }
};
</script>
