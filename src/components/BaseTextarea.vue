<template>
  <div class="field">
    <label class="label" v-if="label">{{ label }}</label>
    <div class="control">
      <textarea
        class="textarea has-fixed-size"
        :class="{
          'is-danger': v.$error
        }"
        v-model="model"
        :placeholder="placeholder"
      />
    </div>
    <div v-if="v.$error" class="help is-danger">Field is invalid!</div>
  </div>
</template>

<script>
export default {
  name: 'base-textarea',
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
