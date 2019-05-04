<template>
  <div class="modal-content">
    <div class="modal-header">
      <h5>{{ modalTitle }}</h5>
      <button @click="modalCloseAction" type="button" class="close" aria-label="Close">
        <span aria-hidden="true">×</span>
      </button>
    </div>
    <div v-if="$slots['modal-body']" class="modal-body">
      <slot name="modal-body"/>
    </div>
    <div v-if="$slots['modal-footer']" class="modal-footer">
      <slot name="modal-footer"/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'base-modal-content',
  props: {
    modalTitle: {
      required: true,
      type: String
    },
    modalCloseAction: {
      required: true,
      type: Function
    }
  }
};
</script>
