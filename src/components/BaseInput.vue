<template>
  <div class="form-group">
    <label v-if="label">{{ label }}</label>
    <input
      :type="type"
      class="form-control"
      :class="{
        'is-invalid': v.$error
      }"
      v-model="model"
      :placeholder="placeholder"
    >
    <div v-if="v.$error" class="invalid-feedback">Field is invalid!</div>
  </div>
</template>

<script>
export default {
  name: 'base-input',
  props: {
    label: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    placeholder: {
      type: String,
      default: ''
    },
    value: {
      type: [String, Number],
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

