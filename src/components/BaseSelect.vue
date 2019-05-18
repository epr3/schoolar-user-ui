<template>
  <div class="field">
    <div class="control">
      <div class="select">
        <select v-model="model" :value="value">
          <option :value="null">{{ label }}</option>
          <option v-for="item in options" :value="item.value" :key="item.id">
            {{ item.label }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'base-select',
  props: {
    label: {
      type: String,
      required: true
    },
    value: {
      type: String,
      default: null
    },
    v: {
      type: Object,
      required: true
    },
    options: {
      type: Array,
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
