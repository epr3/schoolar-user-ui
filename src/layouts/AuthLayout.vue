<template>
  <div>
    <nav class="navbar is-info" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <div class="navbar-item" @click="$router.push('/')">Schoolar</div>

        <a
          role="button"
          class="navbar-burger burger"
          :class="{ 'is-active': showNavbar }"
          aria-label="menu"
          aria-expanded="false"
          data-target="navbarBasicExample"
          @click="showNavbar = !showNavbar"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div id="navbarBasicExample" class="navbar-menu" :class="{ 'is-active': showNavbar }">
        <div class="navbar-start">
          <router-link class="navbar-item" to="/" exact>Home</router-link>
          <router-link
            class="navbar-item"
            to="/courses"
          >All Courses</router-link>
          <router-link
            v-if="this.profile && this.profile.professor"
            class="navbar-item"
            :to="`/users/${this.profile.professor.userId}`"
          >My Courses</router-link>
          <router-link
            v-if="this.profile && this.profile.professor"
            class="navbar-item"
            to="/tests"
          >Quizes</router-link>
          <router-link
            v-if="this.profile && this.profile.student"
            class="navbar-item"
            to="/quiz/join"
          >Join quiz</router-link>
          <router-link
            v-if="this.profile && this.profile.student"
            class="navbar-item"
            to="/quiz/results"
          >Results</router-link>
        </div>

        <div class="navbar-end">
          <div class="navbar-item">{{ name }}</div>
          <div class="navbar-item">
            <base-button type="primary" @click="logout">Log out</base-button>
          </div>
        </div>
      </div>
    </nav>
    <div class="alert-list" v-if="errors.length">
      <base-alert v-for="(error, index) in errors" :key="index" :message="error" type="danger"/>
    </div>
    <slot></slot>
    <modal-container/>
  </div>
</template>

<style lang="scss" scoped>
.alert-list {
  position: absolute;
  right: 0;
  top: 60px;
  z-index: 9999;
}
</style>

<script>
import { mapState } from 'vuex';
import { onLogout } from '../plugins/vue-apollo';

import profileQueryMixin from '../mixins/profileQueryMixin';

import ModalContainer from '../containers/ModalContainer.vue';

import BaseButton from '../components/BaseButton.vue';
import BaseAlert from '../components/BaseAlert';

export default {
  name: 'auth-layout',
  data: () => ({
    showNavbar: false
  }),
  mixins: [profileQueryMixin],
  components: {
    BaseButton,
    ModalContainer,
    BaseAlert
  },
  computed: {
    ...mapState('Error', ['errors']),
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
