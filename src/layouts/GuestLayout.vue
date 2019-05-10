<template>
  <div class="container-fluid container__login">
    <slot></slot>
  </div>
</template>

<style lang="scss">
.container__login {
  height: 100vh;
}
</style>

<script>
export default {
  name: 'guest-layout'
};
</script>
