<template>
  <div :class="['notification', alertType]">{{ message }}</div>
</template>

<script>
export default {
  name: 'base-alert',
  props: {
    type: {
      type: String,
      default: ''
    },
    message: {
      type: String,
      required: true
    }
  },
  computed: {
    alertType() {
      return this.type ? `is-${this.type}` : '';
    }
  }
};
</script>
