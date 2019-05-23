<template>
  <div class="box">
    <div class="media">
      <div class="media-content">
        <div class="content">
          <p>
            <strong>{{ subject }} - {{ eventType }}</strong>
          </p>
          <p>
            <small>{{ date | humanDate }}</small>
          </p>
          <p>Score: {{ (correctAnswers * score) / noOfQuestions }}%</p>
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
    score: {
      type: Number,
      required: true
    },
    subject: {
      type: String,
      required: true
    },
    date: {
      type: String,
      required: true
    },
    eventType: {
      type: String,
      required: true
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
