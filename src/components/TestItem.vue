<template>
  <div class="box">
    <article class="media">
      <div class="media-content">
        <p>
          <strong>{{ name }}</strong>
          <small>@{{ subject }}</small>
        </p>
        <div class="level">
          <div class="level-left">
            <div class="level-item">{{ numberOfQuestions }}</div>
            <div class="level-item">Edit</div>
            <div class="level-item">Delete</div>
          </div>
        </div>
      </div>
    </article>
  </div>
</template>

<script>
export default {
  name: 'test-item',
  props: {
    id: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    numberOfQuestions: {
      type: Number,
      required: true
    },
    subject: {
      type: String,
      required: true
    }
  }
};
</script>
