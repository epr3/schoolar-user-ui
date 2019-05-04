<template>
  <div class="container-fluid container__login">
    <slot></slot>
    <modal-container />
  </div>
</template>

<style lang="scss">
.container__login {
  height: 100vh;
}
</style>

<script>
import ModalContainer from '@/containers/ModalContainer.vue';

export default {
  name: 'guest-layout',
  components: {
    ModalContainer
  }
};
</script>
