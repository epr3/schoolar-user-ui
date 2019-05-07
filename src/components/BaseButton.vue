<template>
  <router-link tag="button" v-if="routerPath" :to="routerPath" class="button" :class="btnStyle">
    <slot></slot>
  </router-link>
  <button
    v-else
    @click="$emit('click')"
    type="button"
    :disabled="disabled"
    class="button"
    :class="btnStyle"
  >
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: 'base-button',
  props: {
    size: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: ''
    },
    outline: {
      type: Boolean,
      default: false
    },
    inverted: {
      type: Boolean,
      default: false
    },
    outlined: {
      type: Boolean,
      default: false
    },
    rounded: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    routerPath: {
      type: String,
      default: ''
    }
  },
  computed: {
    btnStyle() {
      let style = '';

      if (this.size) {
        style += `is-${this.size} `;
      }

      if (this.inverted) {
        style += 'is-inverted';
      }

      if (this.outlined) {
        style += 'is-outlined';
      }

      if (this.rounded) {
        style += 'is-rounded';
      }

      if (this.type) {
        style += `is-${this.type} `;
      }

      return style.slice(0, -1);
    }
  }
};
</script>
