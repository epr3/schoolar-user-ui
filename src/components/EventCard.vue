<template>
  <div class="card" @click="$emit('click')" :style="{ marginBottom: '10px' }">
    <div class="card-header" :style="{ backgroundColor: color, height: '20px' }"/>
    <div class="card-content">
      <p>{{ subject }} - {{ type }}</p>
      <p v-if="professor">
        <font-awesome-icon icon="user-tie"/>
        {{ professor }}
      </p>
      <p v-if="group">
        <font-awesome-icon icon="users"/>
        {{ group }}
      </p>
      <p>
        <font-awesome-icon icon="building"/>
        {{ room }}
      </p>
      <p>
        <font-awesome-icon icon="clock"/>
        {{ startTime }} - {{ endTime }}
      </p>
    </div>
    <div class="card-footer">
      <slot name="footer"/>
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
