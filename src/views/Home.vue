<template>
  <auth-layout>
    <div class="hero is-primary">
      <div class="hero-body">
        <div class="content">
          <div class="container">
            <h1 class="title">
              Hello
              <span v-if="profile && profile.student">{{ profile.student.name }}</span>
              <span v-if="profile && profile.professor">{{ profile.professor.name }}</span>
            </h1>
            <h2 class="subtitle">Please click one of the options in the navbar to start.</h2>
          </div>
        </div>
      </div>
    </div>
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
