<template>
  <div class="field">
    <div class="file has-name">
      <label class="file-label">
        <input
          class="file-input"
          :class="{
            'is-danger': v.$error
          }"
          type="file"
          autocomplete="off"
          @change="handleFileChange"
        />
        <span class="file-cta">
          <span class="file-icon">
            <font-awesome-icon icon="upload"/>
          </span>
          <span class="file-label">Choose a file…</span>
        </span>
        <span class="file-name">{{ value && value.name }}</span>
      </label>
    </div>
    <div v-if="v.$error" class="help is-danger">Field is invalid!</div>
  </div>
</template>

<script>
export default {
  name: 'base-file-input',
  props: {
    value: {
      type: File,
      default: null
    },
    v: {
      type: Object,
      required: true
    }
  },
  methods: {
    handleFileChange(e) {
      this.v.$touch();
      this.$emit('input', e.target.files[0]);
    }
  }
};
</script>
