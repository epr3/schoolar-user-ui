<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    {{ user }}
    <p v-if="user && user.role === 'PROFESSOR'">Professor</p>
    <p v-if="user && user.role === 'STUDENT'">Student</p>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
export default {
  name: 'home',
  mounted() {
    this.getUser();
  },
  computed: {
    ...mapGetters({
      userQuery: 'entities/users/query'
    }),
    user() {
      return this.userQuery().first();
    }
  },
  methods: {
    ...mapActions('User', ['getUser'])
  }
};
</script>
