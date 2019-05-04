<template>
  <router-link tag="button" v-if="routerPath" :to="routerPath" class="btn" :class="btnStyle">
    <slot></slot>
  </router-link>
  <button
    v-else
    @click="$emit('click')"
    type="button"
    :disabled="disabled"
    class="btn"
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
    block: {
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
        style += `btn-${this.size} `;
      }

      if (this.type) {
        if (this.outline) {
          style += `btn-outline-${this.type} `;
        } else {
          style += `btn-${this.type} `;
        }
      }

      if (this.block) {
        style += 'btn-block ';
      }

      if (this.disabled) {
        style += 'btn-disabled ';
      }

      return style.slice(0, -1);
    }
  }
};
</script>
