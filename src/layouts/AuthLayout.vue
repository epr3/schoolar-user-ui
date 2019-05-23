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
          <router-link
            v-if="this.profile && this.profile.professor"
            class="navbar-item"
            to="/tests"
          >
            Tests
          </router-link>
          <router-link
            v-if="this.profile && this.profile.student"
            class="navbar-item"
            to="/quiz/join"
          >
            Join test
          </router-link>
        </div>

        <div class="navbar-end">
          <div class="navbar-item">{{ name }}</div>
          <div class="navbar-item">
            <base-button type="primary" @click="logout">Log out</base-button>
          </div>
        </div>
      </div>
    </nav>
    <slot></slot>
    <modal-container/>
  </div>
</template>

<script>
import { onLogout } from '../plugins/vue-apollo';

import profileQueryMixin from '../mixins/profileQueryMixin';

import ModalContainer from '../containers/ModalContainer.vue';

import BaseButton from '../components/BaseButton.vue';

export default {
  name: 'auth-layout',
  data: () => ({
    showNavbar: false
  }),
  mixins: [profileQueryMixin],
  components: {
    BaseButton,
    ModalContainer
  },
  computed: {
    name() {
      if (this.profile) {
        if (this.profile.student) {
          return `${this.profile.student.name} ${this.profile.student.surname}`;
        }
        if (this.profile.professor) {
          return `${this.profile.professor.title} ${
            this.profile.professor.name
          } ${this.profile.professor.surname}`;
        }
      }
      return '';
    }
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
