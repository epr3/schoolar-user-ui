<template>
  <auth-layout>
    <img alt="Vue logo" src="../assets/logo.png">
    {{ profile }}
    <p v-if="profile && profile.role === 'PROFESSOR'">Professor</p>
    <p v-if="profile && profile.role === 'STUDENT'">Student</p>
  </auth-layout>
</template>

<script>
import AuthLayout from '../layouts/AuthLayout.vue';

import profileQueryMixin from '../mixins/profileQueryMixin';

export default {
  name: 'home',
  mixins: [profileQueryMixin],
  components: {
    AuthLayout
  }
};
</script>
