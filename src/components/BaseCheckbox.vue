<template>
  <div class="form-group">
    <div class="custom-control custom-checkbox">
      <input
        :id="id"
        type="checkbox"
        class="custom-control-input"
        :class="{
          'is-invalid': v.$error
        }"
        :checked="value"
        v-model="model"
      >
      <label :for="id" class="custom-control-label">{{ label }}</label>
    </div>
  </div>
</template>

<script>
export default {
  name: 'base-checkbox',
  props: {
    id: {
      type: String,
      required: true
    },
    label: {
      type: String,
      required: true
    },
    value: {
      type: Boolean,
      default: false
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

