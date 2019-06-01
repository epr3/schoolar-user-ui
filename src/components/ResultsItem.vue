<template>
  <div class="box">
    <div class="media">
      <div class="media-content">
        <div class="content">
          <p v-if="subject && eventType">
            <strong>{{ subject }} - {{ eventType }}</strong>
          </p>
          <p>
            <small>
              <font-awesome-icon icon="calendar" />
              {{ date | humanDate }}
            </small>
          </p>
          <strong>Score: {{ (correctAnswers / noOfQuestions) * 100 }}%</strong>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { DateTime } from 'luxon';

export default {
  name: 'results-item',
  filters: {
    humanDate(value) {
      return DateTime.fromISO(value).toFormat('dd MMM yyyy HH:mm');
    }
  },
  props: {
    subject: {
      type: String,
      default: ''
    },
    date: {
      type: String,
      required: true
    },
    eventType: {
      type: String,
      default: ''
    },
    noOfQuestions: {
      type: Number,
      required: true
    },
    correctAnswers: {
      type: Number,
      required: true
    }
  }
};
</script>
