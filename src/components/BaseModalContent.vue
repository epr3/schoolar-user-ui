<template>
  <div class="modal-card" @click.stop>
    <header class="modal-card-head">
      <p class="modal-card-title">{{ modalTitle }}</p>
      <button class="delete" @click="modalCloseAction" aria-label="close" />
    </header>
    <section v-if="$slots['modal-body']" class="modal-card-body">
      <slot name="modal-body" />
    </section>
    <footer v-if="$slots['modal-footer']" class="modal-card-foot">
      <slot name="modal-footer" />
    </footer>
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
