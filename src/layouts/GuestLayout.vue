<template>
  <div class="container-fluid container__login">
    <div class="alert-list" v-if="errors.length">
      <base-alert
        v-for="(error, index) in errors"
        :key="index"
        :message="error"
        type="danger"
      />
    </div>
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
.alert-list {
  position: absolute;
  top: 10px;
  left: 0;
  width: 100%;
  padding: 0 15px;
  z-index: 9999;
}
.container__login {
  height: 100vh;
  .columns {
    height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>

<script>
import { mapState } from 'vuex';

import BaseAlert from '../components/BaseAlert';

export default {
  name: 'guest-layout',
  components: {
    BaseAlert
  },
  computed: {
    ...mapState('Error', ['errors'])
  }
};
</script>
