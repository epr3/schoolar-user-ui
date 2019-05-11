<template>
  <div class="level notification" @click="$emit('click')">
    <div class="level-left">
      <div class="level-item">
        <span class="subtitle is-5">Session code: {{ code }}</span>
      </div>
    </div>
    <div class="level-right">
      <div class="level-item">{{ subject }}</div>
      <div class="level-item">{{ type }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'session-item',
  props: {
    code: {
      type: String,
      required: true
    },
    subject: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    }
  }
};
</script>
