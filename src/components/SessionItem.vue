<template>
  <div class="card">
    <div class="card-content">
      <p>
        {{ subject }}
        <span class="tag" :style="{ backgroundColor: color }">{{ type }}</span>
      </p>

      <p>
        <font-awesome-icon icon="calendar" />
        <span>{{ date | toHumanDate }}</span>
      </p>
    </div>
    <div class="card-footer">
      <div class="card-footer-item" @click="$emit('click')">Join session</div>
    </div>
  </div>
</template>

<script>
import { DateTime } from 'luxon';

export default {
  name: 'session-item',
  filters: {
    toHumanDate(value) {
      return DateTime.fromISO(value).toFormat('dd-LL-yyyy HH:mm');
    }
  },
  props: {
    subject: {
      type: String,
      required: true
    },
    color: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    date: {
      type: String,
      required: true
    }
  }
};
</script>
