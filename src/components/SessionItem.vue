<template>
  <div class="level notification" @click="$emit('click')">
    <div class="level-left">
      <div class="level-item">{{ subject }}</div>
      <div class="level-item">{{ type }}</div>
    </div>
    <div class="level-right">
      <base-button type="primary" @click="$emit('click')">
        Join session
      </base-button>
    </div>
  </div>
</template>

<script>
import BaseButton from './BaseButton';

export default {
  name: 'session-item',
  components: {
    BaseButton
  },
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
