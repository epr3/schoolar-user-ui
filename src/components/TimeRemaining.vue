<template>
  <h5 class="title">
    Time remaining:
    <template v-if="!testFinished">
      {{ timeRemaining.hours }}h {{ timeRemaining.minutes }}m
      {{ parseInt(timeRemaining.seconds) }}s
    </template>
    <template v-else>none</template>
  </h5>
</template>

<script>
import { DateTime, Duration } from 'luxon';
import { setInterval, clearInterval } from 'timers';

export default {
  name: 'time-remaining',
  data() {
    return {
      timeRemaining: DateTime.fromISO(this.joinDate)
        .plus({ minutes: this.duration })
        .diff(DateTime.local(), ['hours', 'minutes', 'seconds'])
        .toObject(),
      timerInterval: null,
      testFinished: false
    };
  },
  mounted() {
    this.timerInterval = setInterval(() => {
      this.timeRemaining = DateTime.fromISO(this.joinDate)
        .plus({ minutes: this.duration })
        .diff(DateTime.local(), ['hours', 'minutes', 'seconds'])
        .toObject();
    }, 1000);
    if (Duration.fromObject(this.timeRemaining).as('milliseconds') < 0) {
      this.$emit('test:end');
      this.testFinished = true;
      clearInterval(this.timerInterval);
    }
  },
  destroyed() {
    clearInterval(this.timerInterval);
  },
  props: {
    duration: {
      type: Number,
      required: true
    },
    joinDate: {
      type: String,
      required: true
    }
  },
  watch: {
    timeRemaining(val) {
      if (Duration.fromObject(val).as('milliseconds') < 0) {
        this.$emit('test:end');
        this.testFinished = true;
        clearInterval(this.timerInterval);
      }
    }
  }
};
</script>
