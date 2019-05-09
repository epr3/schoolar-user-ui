<template>
  <div class="card">
    <div class="card-header" :style="{ backgroundColor: color }">
      <h5 class="card-header-title">{{ type }}</h5>
    </div>
    <div class="card-content">
      <p>{{ subject }}</p>
      <p>{{ professor }}</p>
      <p>{{ startTime }} - {{ endTime }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'event-card',
  props: {
    type: {
      type: String,
      required: true
    },
    subject: {
      type: String,
      required: true
    },
    professor: {
      type: String,
      required: true
    },
    startTime: {
      type: String,
      required: true
    },
    endTime: {
      type: String,
      required: true
    },
    color: {
      type: String,
      required: true
    }
  }
};
</script>
