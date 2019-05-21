<template>
  <div class="field">
    <label class="label" v-if="label">{{ label }}</label>
    <date-picker
      lang="en"
      :type="type"
      :class="{
        'is-danger': v.$error
      }"
      v-model="model"
      :format="format"
      :placeholder="placeholder"
      :time-picker-options="timePickerOptions"
      confirm
      input-class="input"
      width="100%"
    />
    <div v-if="v.$error" class="invalid-feedback">Field is invalid!</div>
  </div>
</template>

<script>
import DatePicker from 'vue2-datepicker';

export default {
  name: 'base-date-time-picker',
  data: () => ({
    timePickerOptions: {
      start: '07:30',
      step: '00:30',
      end: '20:50'
    }
  }),
  components: {
    DatePicker
  },
  props: {
    label: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    format: {
      type: String,
      required: true
    },
    placeholder: {
      type: String,
      default: ''
    },
    value: {
      type: [Date, String],
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
