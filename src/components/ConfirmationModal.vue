<template>
  <base-modal-content
    :modal-title="modalTitle"
    :modal-close-action="modalCloseAction"
  >
    <template #modal-footer>
      <base-button type="success" @click="modalSuccessAction">Yes</base-button>
      <base-button type="danger" @click="modalCloseAction">No</base-button>
    </template>
  </base-modal-content>
</template>

<script>
import BaseModalContent from './BaseModalContent.vue';
import BaseButton from './BaseButton.vue';

export default {
  name: 'confirmation-modal',
  components: {
    BaseModalContent,
    BaseButton
  },
  props: {
    modalTitle: {
      required: true,
      type: String
    },
    modalCloseAction: {
      required: true,
      type: Function
    },
    modalSuccessAction: {
      required: true,
      type: Function
    }
  }
};
</script>
