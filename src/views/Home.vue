<template>
  <auth-layout>
    <img alt="Vue logo" src="../assets/logo.png">
    {{ profile }}
    <p v-if="profile && profile.role === 'PROFESSOR'">Professor</p>
    <p v-if="profile && profile.role === 'STUDENT'">Student</p>
  </auth-layout>
</template>

<script>
import PROFILE_QUERY from '../graphql/Auth/Profile.gql';

import AuthLayout from '../layouts/AuthLayout.vue';

export default {
  name: 'home',
  data: () => ({
    profile: null
  }),
  apollo: {
    profile: PROFILE_QUERY
  },
  components: {
    AuthLayout
  }
};
</script>
