<template>
  <div class="field">
    <label class="label" v-if="label">{{ label }}</label>
    <div class="control">
      <markdown-editor v-model="model" :configs="configs" />
    </div>
    <div v-if="v.$error" class="help is-danger">Field is invalid!</div>
  </div>
</template>

<style lang="scss">
@import '~simplemde/dist/simplemde.min.css';
.markdown-editor .CodeMirror {
  min-height: 100px;
  height: 100px;
}
</style>

<script>
import markdownEditor from 'vue-simplemde/src/markdown-editor';

export default {
  name: 'base-markdown-editor',
  data() {
    return {
      configs: {
        placeholder: this.placeholder,
        toolbar: [
          'bold',
          'italic',
          'heading',
          'code',
          '|',
          'quote',
          'unordered-list',
          'ordered-list',
          '|',
          'guide',
          '|',
          'preview'
        ]
      }
    };
  },
  components: {
    markdownEditor
  },
  props: {
    label: {
      type: String,
      required: true
    },
    placeholder: {
      type: String,
      default: ''
    },
    value: {
      type: String,
      default: ''
    },
    v: {
      type: Object,
      required: true
    }
  },
  computed: {
    model: {
      get() {
        return this.value;
      },
      set(value) {
        this.v.$touch();
        this.$emit('input', value);
      }
    }
  }
};
</script>
