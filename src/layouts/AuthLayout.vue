<template>
  <div>
    <nav class="navbar" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <router-link class="navbar-item" to="/">
          <img src="https://bulma.io/images/bulma-logo.png" width="112" height="28">
        </router-link>

        <a
          role="button"
          class="navbar-burger burger"
          aria-label="menu"
          aria-expanded="false"
          data-target="navbarBasicExample"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div id="navbarBasicExample" class="navbar-menu">
        <div class="navbar-start">
          <router-link class="navbar-item" to="/">Home</router-link>
          <router-link class="navbar-item" to="/schedule">Schedule</router-link>
        </div>

        <div class="navbar-end">
          <div class="navbar-item">
            <base-button type="primary" @click="logout">Log out</base-button>
          </div>
        </div>
      </div>
    </nav>
    <slot></slot>
  </div>
</template>

<script>
import { onLogout } from '../plugins/vue-apollo.js';

import BaseButton from '../components/BaseButton.vue';

export default {
  name: 'auth-layout',
  data: () => ({
    showNavbar: false
  }),
  components: {
    BaseButton
  },
  methods: {
    toggleNavbar() {
      this.showNavbar = !this.showNavbar;
    },
    async logout() {
      await onLogout(this.$apolloProvider.defaultClient);
      this.$router.replace('/login');
    }
  }
};
</script>
