<template>
  <div class="field">
    <label class="radio">
      <input
        :name="name"
        type="radio"
        v-model="model"
        :checked="model === value"
        :value="inputValue"
      />
      {{ label }}
    </label>
  </div>
</template>

<script>
export default {
  name: 'base-radio-button',
  props: {
    label: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    value: {
      type: String,
      required: true
    },
    inputValue: {
      type: String,
      required: true
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
