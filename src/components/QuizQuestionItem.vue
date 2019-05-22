<template>
  <div class="card">
    <div class="card-content">
      <div class="media">
        <div class="media-left">
          <img
            :src="imagePath || 'https://via.placeholder.com/128/128'"
            alt="questionImage"
            class="image is-128x128"
          >
        </div>
        <div class="media-content">
          <div class="content">
            <p v-html="previewText" />
          </div>
        </div>
        <div class="media-right">
          <button class="delete" @click="deleteAction"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import marked from 'marked';

export default {
  name: 'quiz-question-item',
  props: {
    imagePath: {
      type: String,
      default: 'https://via.placeholder.com/128/128'
    },
    description: {
      type: String,
      required: true
    },
    deleteAction: {
      type: Function,
      required: true
    }
  },
  computed: {
    previewText() {
      marked.setOptions({
        renderer: new marked.Renderer(),
        gfm: true,
        tables: true,
        breaks: true,
        pedantic: false,
        sanitize: true,
        smartLists: true,
        smartypants: false
      });
      return marked(this.description);
    }
  }
};
</script>
