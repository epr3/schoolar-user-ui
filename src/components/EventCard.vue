<template>
  <div class="card" @click="$emit('click')" :style="{ marginBottom: '10px' }">
    <div class="card-header" :style="{ backgroundColor: color }">
      <h5 class="card-header-title">{{ type }}</h5>
    </div>
    <div class="card-content">
      <p>{{ subject }}</p>
      <p v-if="professor">{{ professor }}</p>
      <p v-if="group">Group {{ group }}</p>
      <p>Room {{ room }}</p>
      <p>{{ startTime }} - {{ endTime }}</p>
    </div>
    <div class="card-footer">
      <slot name="footer" />
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
    room: {
      type: String,
      required: true
    },
    group: {
      type: String
    },
    professor: {
      type: String
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
