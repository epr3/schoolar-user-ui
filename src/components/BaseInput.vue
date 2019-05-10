<template>
  <div class="field">
    <label class="label" v-if="label">{{ label }}</label>
    <div class="control">
      <input
        :type="type"
        class="input"
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
