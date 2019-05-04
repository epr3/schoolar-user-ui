<template>
  <div>
    <nav class="navbar navbar-expand-sm navbar-light bg-light">
      <router-link class="navbar-brand" to="/">Schoolar</router-link>
      <button
        class="navbar-toggler"
        type="button"
        aria-label="Toggle navigation"
        @click="toggleNavbar"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" :class="{ show: showNavbar }">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item active">
            <router-link class="nav-link" to="/">
              Home
              <span class="sr-only">(current)</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/accounts">Accounts</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/faculties">Faculties</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/groups">Groups</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/schedule">Schedule</router-link>
          </li>
        </ul>
      </div>
    </nav>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'auth-layout',
  data: () => ({
    showNavbar: false
  }),
  methods: {
    toggleNavbar() {
      this.showNavbar = !this.showNavbar;
    }
  }
};
</script>
